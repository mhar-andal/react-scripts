const chalk = require('chalk');
const getFiles = require('../utils/getFiles');

class FileSizePlugin {
  constructor(options) {
    this.options = options;
  }

  apply(compiler) {
    compiler.plugin('done', () => {
      const files = getFiles('build/static');
      console.log();
      files.forEach((file) => {
        console.log(`  ${file.name} - ${chalk.yellow(file.size)}`);
      });
      console.log();
    });
  }
}

module.exports = FileSizePlugin;
