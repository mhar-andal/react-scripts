process.env.NODE_ENV = 'test';

require('../config/env');

const path = require('path');
const jest = require('jest');
const paths = require('../config/paths');
const jestConfig = require('../config/jest');

process.env.NODE_PATH = paths.appRoot;

process.on('unhandledRejection', (err) => {
  throw err;
});

const argv = process.argv.slice(2);

if (!process.env.CI && argv.indexOf('--coverage') < 0) {
  argv.push('--watch');
}

const args = jestConfig(relativePath => path.resolve(__dirname, '..', relativePath), path.resolve(paths.appSrc, '..'));

argv.push('--no-cache', '--config', JSON.stringify(args));

jest.run(argv);
