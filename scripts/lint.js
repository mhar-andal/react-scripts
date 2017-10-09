const chalk = require('chalk');
const CLIEngine = require('eslint').CLIEngine;
const eslintConfig = require('eslint-config');
const paths = require('../config/paths');
const log = require('../config/utils/log');

if (process.argv.includes('--fix')) {
  eslintConfig.fix = true;
}

function lintFiles() {
  log(`Linting files in ${chalk.green(paths.appRoot)}`);

  // https://github.com/eslint/eslint/pull/6922
  if (eslintConfig.globals) delete eslintConfig.globals;

  const cli = new CLIEngine(eslintConfig);
  const report = cli.executeOnFiles([paths.appRoot]);
  const formatter = cli.getFormatter();

  if (process.argv.includes('--fix')) {
    CLIEngine.outputFixes(report);
  }

  log(formatter(report.results));

  const errorCount = report.results.reduce((sum, result) => {
    return result.errorCount + sum;
  }, 0);
  if (errorCount !== 0) process.exit(1);
}

lintFiles();
