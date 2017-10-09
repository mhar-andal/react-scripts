const chalk = require('chalk');
const webpack = require('webpack');
const log = require('./log');
const config = require('../webpack.prod');

function printErrors(errors) {
  log.error('Failed to compile', 2);
  errors.forEach((err) => {
    log(`  ${err.message || err}`, 1);
  });
}

function webpackCompile() {
  let compiler;
  try {
    compiler = webpack(config);
  } catch (err) {
    printErrors([err]);
    process.exit(1);
  }

  compiler.run((err, stats) => {
    if (err) {
      printErrors([err]);
      process.exit(1);
    }

    if (stats.compilation.errors.length) {
      printErrors(stats.compilation.errors);
      process.exit(1);
    }

    log(`Compiled ${chalk.green('successfully')}`, 'success', 1);
  });
}

module.exports = webpackCompile;
