const fs = require('fs');
const paths = require('./paths');

module.exports = (resolve, rootDir) => {
  const setupTestFrameworkScriptFile =
    fs.existsSync(paths.testsSetup)
    && paths.testsSetup;

  const defaultConfig = {
    collectCoverageFrom: [`${paths.appRoot}/**/*.{js,jsx}`],
    testPathIgnorePatterns: [
      '<rootDir>[/](build|docs|node_modules|scripts)[/]',
    ],
    testMatch: [
      '<rootDir>**/__tests__/**/?(*.)(spec|test).js?(x)',
      '<rootDir>**/?(*.)(spec|test).js?(x)',
    ],
    testURL: 'http://localhost',
    transform: {
      '^.+\\.(js|jsx)$': resolve('config/jest/babelTransform.js'),
      '^.+\\.css$': resolve('config/jest/cssTransform.js'),
      '^(?!.*\\.(js|jsx|css|json)$)': resolve('config/jest/fileTransform.js'),
    },
    moduleDirectories: [
      'node_modules',
      'app',
      '__tests__',
    ],
  };

  const config = Object.assign({},
    defaultConfig,
    rootDir && { rootDir },
    setupTestFrameworkScriptFile && { setupTestFrameworkScriptFile }
  );

  return config;
};
