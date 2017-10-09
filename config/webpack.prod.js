require('./env');

const fs = require('fs-extra');
const webpack = require('webpack');
const merge = require('webpack-merge');
const autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const PreloadWebpackPlugin = require('preload-webpack-plugin');
const S3Plugin = require('webpack-s3-plugin');
const { BugsnagDeployPlugin, BugsnagSourceMapPlugin } = require('webpack-bugsnag-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const FileSizePlugin = require('./plugins/FileSizePlugin');
const { checkAWS, checkBugsnag } = require('./utils/checkKeys');
const webpackConfig = require('./webpack.common');
const paths = require('./paths');

const isDeploying = process.env.DEPLOY === 'true';
const isProduction = process.env.NODE_ENV === 'production';
const cssFilename = 'static/css/[name].[contenthash:8].css';
const plugins = [];

// clear build directory
fs.emptyDirSync(paths.appBuild);

// add deployment plugins if DEPLOY=true
if (isDeploying && checkAWS()) {
  plugins.push(new S3Plugin({
    s3Options: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      region: process.env.AWS_REGION,
    },
    s3UploadOptions: {
      Bucket: process.env.AWS_BUCKET,
    },
    cdnizerOptions: {
      defaultCDNBase: process.env.CLOUDFRONT_DISTRIBUTION_DOMAIN,
    },
    cloudfrontInvalidateOptions: {
      DistributionId: process.env.CLOUDFRONT_DISTRIBUTION_ID,
      Items: ['/*'],
    },
    progress: false,
  }));
}

// add bugsnag sourcemap upload if deploying production
if (isDeploying && isProduction && checkBugsnag()) {
  plugins.push(new BugsnagDeployPlugin({
    apiKey: process.env.BUGSNAG_API_KEY,
    releaseStage: process.env.NODE_ENV,
    appVersion: process.env.npm_package_version,
  }),
  new BugsnagSourceMapPlugin({
    apiKey: process.env.BUGSNAG_API_KEY,
    publicPath: process.env.BUGSNAG_PUBLIC_PATH,
    overwrite: true,
    appVersion: process.env.npm_package_version,
  }));
}

// production webpack config extends webpack.common
module.exports = merge(webpackConfig, {
  bail: true,

  devtool: 'source-map',

  entry: [
    require.resolve('./polyfills'),
    paths.appIndexJs,
  ],

  profile: true,

  output: {
    path: paths.appBuild,
    filename: 'static/js/[name].[chunkhash:8].js',
    chunkFilename: 'static/js/[name].[chunkhash:8].chunk.js',
    publicPath: '/',
  },

  module: {
    rules: [
      // sass
      {
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          publicPath: Array(cssFilename.split('/').length).join('../'),
          use: [
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1,
                minimize: true,
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
        }),
      },
    ],
  },

  plugins: [
    // extract css to its own file
    new ExtractTextPlugin({
      filename: cssFilename,
      allChunks: true,
    }),

    // TODO: need to fix polyfill.js requires from breaking the chunks

    // new webpack.optimize.CommonsChunkPlugin({
    //   name: 'vendor',
    //   minChunks: module => /node_modules[/\\](?!shared)/.test(module.context),
    // }),

    // new webpack.optimize.CommonsChunkPlugin({
    //   name: 'manifest',
    // }),

    // optimize js
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.AggressiveMergingPlugin(),

    // lodash optimizations
    // new LodashModuleReplacementPlugin(),

    // minify and inject html with bundle
    new HtmlWebpackPlugin({
      inject: true,
      template: paths.appHtml,
      chunksSortMode: 'dependency',
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      },
    }),

    // minify js
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        screw_ie8: true, // React doesn't support IE8
        warnings: false,
      },
      mangle: {
        screw_ie8: true,
      },
      output: {
        comments: false,
        screw_ie8: true,
      },
      sourceMap: true,
    }),

    // gzip assets
    new CompressionPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      test: /\.js$|\.css$|\.html$/,
      threshold: 10240,
      minRatio: 0.8,
    }),

    // make sure script tags are async to avoid blocking html render
    new ScriptExtHtmlWebpackPlugin({
      defaultAttribute: 'async',
    }),

    // preload chunks
    new PreloadWebpackPlugin(),

    // output file sizes
    new FileSizePlugin(),
  ].concat(plugins),

  performance: {
    maxAssetSize: 300000,
    maxEntrypointSize: 300000,
    hints: 'warning',
  },
});
