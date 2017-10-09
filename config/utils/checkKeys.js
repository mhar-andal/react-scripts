const chalk = require('chalk');
const log = require('./log');

function checkKeys(keys) {
  let valid = true;

  keys.map((key) => {
    if (!process.env[key]) {
      valid = false;
      log.error(`Missing ${chalk.green(key)} environment variable`, 2);
      return false;
    }
    return key;
  });

  return valid;
}

module.exports.checkAWS = () => {
  return checkKeys([
    'AWS_ACCESS_KEY_ID',
    'AWS_SECRET_ACCESS_KEY',
    'AWS_REGION',
    'AWS_BUCKET',
    'CLOUDFRONT_DISTRIBUTION_DOMAIN',
    'CLOUDFRONT_DISTRIBUTION_ID',
  ]);
};

module.exports.checkBugsnag = () => {
  return checkKeys([
    'BUGSNAG_API_KEY',
    'BUGSNAG_PUBLIC_PATH',
  ]);
};
