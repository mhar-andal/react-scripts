const path = require('path');
const babelJest = require('babel-jest');

module.exports = babelJest.createTransformer({
  presets: [
    [require.resolve('babel-preset-env'),
      {
        targets: {
          browsers: ['last 2 versions'],
          ie9: true,
          uglify: false,
        },
        useBuiltIns: true,
      },
    ],
    require.resolve('babel-preset-react'),
  ],
  plugins: [
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
  ],
  babelrc: false,
});
