require('./env');

const webpack = require('webpack');
const merge = require('webpack-merge');
const autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const OpenBrowserPlugin = require('open-browser-webpack-plugin');
const paths = require('./paths');
const webpackConfig = require('./webpack.common');

const PORT = parseInt(process.env.PORT, 10) || 3000;

// development webpack config extends webpack.common
module.exports = merge(webpackConfig, {
  devtool: 'cheap-module-eval-source-map',

  entry: [
    require.resolve('./polyfills'),
    'react-hot-loader/patch',
    `${require.resolve('webpack-dev-server/client')}?http://localhost:${PORT}`,
    require.resolve('webpack/hot/dev-server'),
    paths.appIndexJs,
  ],

  output: {
    pathinfo: true,
    filename: 'static/js/bundle.js',
    publicPath: '/',
  },

  module: {
    rules: [
      {
        test: /\.scss$/,
        exclude: [
          /\.variables\.scss$/,
        ],
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              plugins: () => [
                autoprefixer({
                  browsers: [
                    '>1%',
                    'last 4 versions',
                    'Firefox ESR',
                    'not ie < 9',
                  ],
                }),
              ],
            },
          },
          {
            loader: 'sass-loader',
            options: {
              includePaths: [
                paths.appPublic,
              ],
            },
          },
        ],
      },
    ],
  },

  plugins: [
    // inject js files to index.html
    new HtmlWebpackPlugin({
      inject: true,
      template: paths.appHtml,
    }),

    // HMR support
    new webpack.HotModuleReplacementPlugin(),

    // allow chunks to have names
    new webpack.NamedModulesPlugin(),

    // path fixes for OSX
    new CaseSensitivePathsPlugin(),

    // open browser when app launches
    new OpenBrowserPlugin({ url: `http://localhost:${PORT}` }),
  ],

  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
  },

  performance: {
    hints: false,
  },
});
