const fs = require('fs');
const path = require('path');

const APP_ROOT = process.env.APP_ROOT || 'app';
const NODE_PATH = process.env.NODE_PATH || '';

const appDirectory = fs.realpathSync(process.cwd());

function resolveApp(relativePath) {
  return path.resolve(appDirectory, relativePath);
}

function resolveOwn(relativePath) {
  return path.resolve(__dirname, '..', relativePath);
}

const nodePaths = (NODE_PATH)
  .split(':')
  .filter(Boolean)
  .filter(folder => !path.isAbsolute(folder))
  .map(resolveApp);

module.exports = {
  nodePaths,
  appRoot: APP_ROOT,
  appBuild: resolveApp('build'),
  appPublic: resolveApp('public'),
  appHtml: resolveApp('public/index.html'),
  appIndexJs: resolveApp(`${APP_ROOT}/index.js`),
  appPackageJson: resolveApp('package.json'),
  appSrc: resolveApp(APP_ROOT),
  yarnLockFile: resolveApp('yarn.lock'),
  testsSetup: resolveApp(`__tests__/test-setup.js`),
  appNodeModules: resolveApp('node_modules'),
  ownNodeModules: resolveOwn('node_modules'),
};
