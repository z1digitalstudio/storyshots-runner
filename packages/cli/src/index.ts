import { Builtins, Cli } from 'clipanion';

import { ImportDiffs } from './commands/ImportDiffs';

declare const _VERSION_: string;

const [, , ...args] = process.argv as [string, string, ...string[]];

const cli = new Cli({
  binaryLabel: 'Storyshots Runner',
  binaryName: 'storyshots-runner',
  binaryVersion: _VERSION_,
});

cli.register(Builtins.HelpCommand);
cli.register(ImportDiffs);

cli.runExit(args, Cli.defaultContext).catch(console.error);
