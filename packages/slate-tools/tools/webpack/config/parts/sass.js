const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const SlateConfig = require('@shopify/slate-config');
const config = new SlateConfig(require('../../../../slate-tools.schema'));

const isDevelopment = process.env.NODE_ENV === 'development';

function recursiveIssuer(m) {
  if (m.issuer) {
    return recursiveIssuer(m.issuer);
  } else if (m.name) {
    return m.name;
  } else {
    return false;
  }
}

const part = {
  module: {
    rules: [],
  },
  plugins: [],
  optimization: {
    splitChunks: {
      cacheGroups: {
        'template.search': {
          name: 'template.search',
          test: (m, c, entry = 'template.search') =>
            m.constructor.name === 'CssModule' && recursiveIssuer(m) === entry,
          chunks: 'all',
          enforce: true,
        },
        'template.product': {
          name: 'template.product',
          test: (m, c, entry = 'template.product') =>
            m.constructor.name === 'CssModule' && recursiveIssuer(m) === entry,
          chunks: 'all',
          enforce: true,
        },
        'template.password': {
          name: 'template.password',
          test: (m, c, entry = 'template.password') =>
            m.constructor.name === 'CssModule' && recursiveIssuer(m) === entry,
          chunks: 'all',
          enforce: true,
        },
        'template.page': {
          name: 'template.page',
          test: (m, c, entry = 'template.page') =>
            m.constructor.name === 'CssModule' && recursiveIssuer(m) === entry,
          chunks: 'all',
          enforce: true,
        },
        'template.list-collections': {
          name: 'template.list-collections',
          test: (m, c, entry = 'template.list-collections') =>
            m.constructor.name === 'CssModule' && recursiveIssuer(m) === entry,
          chunks: 'all',
          enforce: true,
        },
      },
    },
  },
};

const sassRule = {
  test: /\.s[ac]ss$/,
  exclude: config.get('webpack.commonExcludes'),
};

const styleLoader = {
  loader: 'style-loader',
  options: {
    hmr: isDevelopment,
  },
};

const cssLoader = {
  loader: 'css-loader',
  options: {
    importLoaders: 2,
    sourceMap: config.get('webpack.sourceMap.styles'),
  },
};

const postcssLoader = {
  loader: 'postcss-loader',
  options: {
    ident: 'postcss',
    sourceMap: config.get('webpack.sourceMap.styles'),
    plugins: config.get('webpack.postcss.plugins'),
  },
};

const cssVarLoader = {loader: '@shopify/slate-cssvar-loader'};

const sassLoader = {
  loader: 'sass-loader',
  options: {sourceMap: config.get('webpack.sourceMap.styles')},
};

if (isDevelopment) {
  sassRule.use = [styleLoader, cssLoader, postcssLoader, sassLoader];
  part.module.rules.push(sassRule);
} else {
  sassRule.use = [
    MiniCssExtractPlugin.loader,
    cssLoader,
    postcssLoader,
    sassLoader,
  ];
  part.module.rules.push(sassRule);
  part.plugins.push(
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
  );
}

module.exports = part;
