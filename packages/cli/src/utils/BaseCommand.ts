import chalk from 'chalk';
import { Command } from 'clipanion';
import { stripIndent } from 'common-tags';

export default abstract class BaseCommand extends Command {
  error(message: string): void {
    this.context.stderr.write(chalk.stderr.red(stripIndent(message)));
    this.context.stderr.write('\n');

    process.exit(1);
  }
}
