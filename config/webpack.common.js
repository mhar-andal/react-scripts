require('./env');

const path = require('path');
const chalk = require('chalk');
const webpack = require('webpack');
const InterpolateHtmlPlugin = require('interpolate-html-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { getClientEnvironment } = require('./env');
const paths = require('./paths');

const env = getClientEnvironment();
const plugins = [];
const presets = [];

if (process.env.NODE_ENV === 'development') {
  plugins.push(
    require.resolve('babel-plugin-transform-react-jsx-self'),
    require.resolve('babel-plugin-transform-react-jsx-source'),
    require.resolve('react-hot-loader/babel'));
}

presets.push([
  require.resolve('babel-preset-env'),
  { targets: { ie: 9, uglify: process.env.NODE_ENV !== 'development' },
    useBuiltIns: false,
    modules: false,
  },
]);

module.exports = {
  resolve: {
    modules: ['node_modules', paths.appRoot].concat(paths.nodePaths),
    extensions: ['.js', '.json', '.jsx'],
  },

  resolveLoader: {
    modules: [
      paths.ownNodeModules,
      paths.appNodeModules,
    ],
  },

  module: {
    strictExportPresence: true,
    rules: [
      // files in public that arent loaded
      {
        exclude: [
          /\.html$/,
          /\.(js|jsx)$/,
          /\.css$/,
          /\.scss$/,
          /\.sass$/,
          /\.json$/,
          /\.bmp$/,
          /\.gif$/,
          /\.jpe?g$/,
          /\.png$/,
          /\.svg$/,
        ],
        loader: 'file-loader',
        options: {
          name: 'static/media/[name].[hash:8].[ext]',
        },
      },
      {
        test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: 'static/media/[name].[hash:8].[ext]',
        },
      },

      // svg
      {
        test: /\.svg$/,
        use: [
          {
            loader: 'babel-loader',
            query: {
              presets: [require.resolve('babel-preset-react')].concat(presets),
            },
          },
          {
            loader: 'react-svg-loader',
            query: {
              svgo: {
                plugins: [{ removeTitle: false }],
                floatPrecision: 2,
              },
              jsx: true,
            },
          },
        ],
      },

      // babel
      {
        test: /\.(js|jsx)$/,
        include: paths.appSrc,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              babelrc: false,
              presets: [require.resolve('babel-preset-react')].concat(presets),
              plugins: [
                // require.resolve('babel-plugin-lodash'),
                require.resolve('babel-plugin-dynamic-import-node'),
                require.resolve('babel-plugin-syntax-dynamic-import'),
                require.resolve('babel-plugin-transform-class-properties'),
                [require.resolve('babel-plugin-transform-object-rest-spread'), { useBuiltIns: true }],
                [require.resolve('babel-plugin-transform-react-jsx'), { useBuiltIns: true }],
                [require.resolve('babel-plugin-transform-runtime'),
                  {
                    helpers: false,
                    polyfill: false,
                    regenerator: true,
                    moduleName: path.dirname(require.resolve('babel-runtime/package')),
                  },
                ],
              ].concat(plugins),
            },
          },
        ],
      },
    ],
  },

  plugins: [
    // add ENV to be accessible from .html
    new InterpolateHtmlPlugin(env.raw),

    // use the correct production/dev builds of dependencies
    new webpack.DefinePlugin(env.stringified),

    // progress bar to show compiling
    new ProgressBarPlugin({
      format: `  Compiling (${chalk.yellow(':percent')}) [:bar] `,
    }),

    // copy files/folders from public to build
    new CopyWebpackPlugin([
      { from: paths.appPublic, to: paths.appBuild },
    ], {
      ignore: ['index.html'],
    }),
  ],

  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
  },
};
