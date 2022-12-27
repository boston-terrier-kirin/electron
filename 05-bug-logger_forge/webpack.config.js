const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const isDev = process.env.NODE_ENV === 'development';

/** @type {import('webpack').Configuration} */
const common = {
  mode: isDev ? 'development' : 'production',
  externals: ['fsevents'],
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env', '@babel/preset-react'],
        },
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.(ico|png|svg|eot|woff?2?)$/,
        type: 'asset/resource',
      },
    ],
  },
  watch: isDev,
  devtool: isDev ? 'source-map' : undefined,
};

/** @type {import('webpack').Configuration} */
const main = {
  ...common,
  target: 'electron-main',
  entry: {
    main: './src/main/index.js',
  },
};

/** @type {import('webpack').Configuration} */
const preload = {
  ...common,
  target: 'electron-preload',
  entry: {
    preload: './src/main/preload.js',
  },
};

/** @type {import('webpack').Configuration} */
const renderer = {
  ...common,
  target: 'web',
  entry: { app: './src/renderer/index.js' },
  plugins: [
    new MiniCssExtractPlugin(),
    new HtmlWebpackPlugin({
      inject: 'body',
      template: './src/renderer/index.html',
    }),
  ],
};

module.exports = [main, preload, renderer];
