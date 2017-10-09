if (!process.env.NODE_ENV) process.env.NODE_ENV = 'development';

// support custom env names, like .env.qa
const path = process.env.NODE_ENV === 'development'
  ? '.env'
  : `.env.${process.env.NODE_ENV}`;

module.exports = require('dotenv').config({ path, silent: true });

module.exports.getClientEnvironment = () => {
  const raw = Object.keys(process.env)
    .reduce(
      (env, key) => {
        const e = env;
        e[key] = process.env[key];
        return e;
      },
      {
        NODE_ENV: process.env.NODE_ENV || 'development',
        APP_VERSION: process.env.npm_package_version,
      });

  // stringify all values so we can feed into Webpack DefinePlugin
  const stringified = {
    'process.env': Object.keys(raw).reduce(
      (env, key) => {
        const e = env;
        e[key] = JSON.stringify(raw[key]);
        return e;
      }, {}),
  };

  return { raw, stringified };
};
