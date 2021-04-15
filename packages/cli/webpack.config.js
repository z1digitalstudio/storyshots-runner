const path = require('path');
const { BannerPlugin, DefinePlugin } = require('webpack');

const { NODE_ENV = 'production' } = process.env;

module.exports = async () => ({
  entry: './src/index.ts',
  devtool: 'source-map',
  mode: NODE_ENV,
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
      },
    ],
  },
  output: {
    filename: '[name].js',
    libraryTarget: 'umd',
    path: path.resolve(__dirname, 'build'),
  },
  plugins: [
    new BannerPlugin({ banner: '#!/usr/bin/env node', raw: true }),
    new DefinePlugin({
      _VERSION_: JSON.stringify(require('./package.json').version),
    }),
  ],
  externals: {
    nodegit: 'nodegit',
    sharp: 'sharp',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  target: 'node',
});
