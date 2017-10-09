
require('../config/env');

const chalk = require('chalk');
const Webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server/lib/Server');
const webpackConfig = require('../config/webpack.dev');
const paths = require('../config/paths');
const log = require('../config/utils/log');

const PORT = parseInt(process.env.PORT, 10) || 3000;

const CONFIG = {
  compress: true,
  contentBase: paths.appPublic,
  watchContentBase: true,
  historyApiFallback: true,
  hot: true,
  publicPath: '/',
  // clientLogLevel: 'none',
  quiet: false,
  inline: true,
  watchOptions: {
    ignored: /node_modules/,
  },
  host: 'localhost',
  overlay: {
    warnings: false,
    errors: true,
  },
  stats: {
    assets: true,
    children: false,
    chunks: false,
    hash: false,
    modules: false,
    publicPath: '/',
    timings: true,
    version: false,
    warnings: true,
    colors: true,
  },
};

function runServer(port) {
  const compiler = Webpack(webpackConfig);

  const devServer = new WebpackDevServer(compiler, CONFIG);

  devServer.listen(port, (err) => {
    if (err) { return log.error(err); }

    // clear the console
    process.stdout.write('\x1B[2J\x1B[3J\x1B[H');

    log(`Starting the ${chalk.green(`${process.env.NODE_ENV}`)} server on port ${chalk.green(port)}`, 2);

    return true;
  });
}

runServer(PORT);
