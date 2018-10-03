const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const WriteFileWebpackPlugin = require('write-file-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const SlateConfig = require('@shopify/slate-config');
const config = new SlateConfig(require('../../../../slate-tools.schema'));

const extractLiquidStyles = new ExtractTextPlugin(
  '[name].styleLiquid.scss.liquid',
);

module.exports = {
  context: config.get('paths.theme.src'),

  output: {
    filename: '[name].js',
    path: config.get('paths.theme.dist.assets'),
    jsonpFunction: 'shopifySlateJsonp',
  },

  resolveLoader: {
    modules: [
      path.resolve(__dirname, '../../../../node_modules'),
      path.resolve(__dirname, '../../../../../../node_modules'),
      path.resolve(__dirname, '../../'),
      path.join(config.get('paths.theme'), 'node_modules'),
    ],
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: config.get('webpack.commonExcludes'),
        loader: 'hmr-alamo-loader',
      },
      {
        test: /index\.liquid$/,
        include: config.get('paths.theme.src.templates'),
        exclude: [...config.get('webpack.commonExcludes')],
        use: [
          {
            loader: 'file-loader',
            options: {
              name: (file) => {
                const name = path.basename(path.dirname(file));
                return `../templates/${name}.liquid`;
              },
            },
          },
        ],
      },
      {
        test: /index\.liquid$/,
        include: config.get('paths.theme.src.layouts'),
        exclude: [...config.get('webpack.commonExcludes')],
        use: [
          {
            loader: 'file-loader',
            options: {
              name: (file) => {
                const name = path.basename(path.dirname(file));
                return `../layout/${name}.liquid`;
              },
            },
          },
        ],
      },
      {
        test: /index\.liquid$/,
        include: config.get('paths.theme.src.sections'),
        exclude: [...config.get('webpack.commonExcludes')],
        use: [
          {
            loader: 'file-loader',
            options: {
              name: (file) => {
                const name = path.basename(path.dirname(file));
                return `../sections/${name}.liquid`;
              },
            },
          },
          {
            loader: 'liquid-loader',
          },
        ],
      },
      {
        test: /\.liquid$/,
        exclude: [
          /index\.liquid$/,
          /(css|scss|sass)\.liquid$/,
          ...config.get('webpack.commonExcludes'),
        ],
        use: [
          {
            loader: 'file-loader',
            options: {
              name: `../snippets/[name].liquid`,
            },
          },
        ],
      },
      // {
      //   test: /assets\/static\//,
      //   exclude: /node_modules/,
      //   loader: 'file-loader',
      //   options: {
      //     name: '[name].[ext]',
      //   },
      // },
      {
        test: /(css|scss|sass)\.liquid$/,
        exclude: config.get('webpack.commonExcludes'),
        use: extractLiquidStyles.extract(['concat-style-loader']),
      },
    ],
  },

  plugins: [
    // ...contextReplacementPlugins(),

    extractLiquidStyles,

    new CopyWebpackPlugin([
      {
        from: config.get('paths.theme.src.locales'),
        to: config.get('paths.theme.dist.locales'),
      },
      {
        from: config.get('paths.theme.src.config'),
        to: config.get('paths.theme.dist.config'),
      },
    ]),

    // new WriteFileWebpackPlugin({
    //   test: /^(?:(?!hot-update.json$).)*\.(liquid|json)$/,
    //   log: false,
    // }),
  ],
};
