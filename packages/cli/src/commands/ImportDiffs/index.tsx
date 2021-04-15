import { Option } from 'clipanion';
import { access as accessCb, constants as FS } from 'fs';
import globCb from 'glob';
import { render } from 'ink';
import Git from 'nodegit';
import type { Repository, Signature } from 'nodegit';
import { join } from 'path';
import React from 'react';
import { promisify } from 'util';

import Importer from './Importer';

import BaseCommand from '$/utils/BaseCommand';

const access = promisify(accessCb);
const glob = promisify(globCb);

const TEMP_BRANCH = '__storyshots_runner_temp__';

export class ImportDiffs extends BaseCommand {
  static paths = [['import-diffs']];

  static usage = {
    category: `Commands`,
    description: `Imports diffs from __diff_output__ directories into git conflicts.`,
    details: `
      This commands scans for __diff_output__ directories, which contain diffs
      of failed storyshots and imports them as a git conflict so they can easily
      be accepted or rejected.
    `,
    examples: [],
  };

  storyshotsDir = Option.String('--storyshots-dir', 'storyshots');

  private static generateCommitSignature(): Signature {
    return Git.Signature.now(
      'storyshots-runner',
      'storyshots-runner@localhost',
    );
  }

  private static async commitEverything(
    repo: Repository,
    message: string,
  ): Promise<void> {
    const signature = ImportDiffs.generateCommitSignature();

    const statusFiles = await repo.getStatus();

    await repo.createCommitOnHead(
      statusFiles.map((statusFile) => statusFile.path()),
      signature,
      signature,
      message,
    );
  }

  private async getStoryshotsDir(): Promise<string> {
    const path = join(process.cwd(), this.storyshotsDir);

    try {
      await access(path, FS.R_OK);
    } catch (e) {
      this.error(`
        The storyshots directory does not exist or is not accessible!
          
        Attempted to read storyshots from:
        '${this.storyshotsDir}'
        
        You can customize this with the '--storyshots-dir' flag.
      `);
    }

    return path;
  }

  private async ensureRepoTreeClean(
    repo: Repository,
    numberOfDiffs: number,
  ): Promise<void> {
    const statusFiles = await repo.getStatus();

    if (statusFiles.length > 0) {
      this.error(`
        Your git working tree is not clean!
        
        Found ${numberOfDiffs} failing storyshots but the diffs can't be 
        imported because you have uncommitted changes.
        
        Please commit your changes and try again.
        
        Remember that __diff_output__ directories must be gitignored.
      `);
    }
  }

  private async setupTempBranch(repo: Repository): Promise<void> {
    // In order to force a conflict, we want to create an orphan branch.
    // Orphan branches don't have a parent, so they are not created from a
    // commit like traditional branches. To create an orphan branch we simply
    // update the head to a non existing branch.
    await repo.setHead(`refs/heads/${TEMP_BRANCH}`);
    await ImportDiffs.commitEverything(repo, 'Import existing files');
  }

  async execute(): Promise<void> {
    const diffs = await glob(
      `${await this.getStoryshotsDir()}/**/__diff_output__/*.png`,
    );

    if (diffs.length === 0) {
      this.context.stdout.write('No diffs found!\n');
      return;
    }

    const repo = await Git.Repository.open('.');

    const branch = await repo.getCurrentBranch();

    await this.ensureRepoTreeClean(repo, diffs.length);
    await this.setupTempBranch(repo);

    render(<Importer diffs={diffs} />);

    this.context.stdout.write('\n');

    await ImportDiffs.commitEverything(repo, 'Import diffs');
    await repo.checkoutBranch(branch);

    // TODO not working
    await repo.mergeBranches(
      branch,
      TEMP_BRANCH,
      ImportDiffs.generateCommitSignature(),
      undefined,
      {
        'allow-unrelated-histories': true,
        squash: true,
      },
    );
  }
}
