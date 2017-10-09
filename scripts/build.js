require('../config/env');

const chalk = require('chalk');
const log = require('../config/utils/log');
const webpackCompile = require('../config/utils/webpackCompile');

log(`Creating an optimized ${chalk.green(process.env.NODE_ENV)} build...`, 2);

// compile the app
webpackCompile();
