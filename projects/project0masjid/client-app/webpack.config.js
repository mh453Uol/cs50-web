const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

var config = {
  entry: './src/js/index.js',
  plugins: [
    new CleanWebpackPlugin({
      exclude: ["*.html"]
    }),
    new HtmlWebpackPlugin({
      template: './src/html/index.html',
      cache: false
    }),
    new HtmlWebpackPlugin({
      template: './src/html/prayertimes.html',
      cache: false
    })
  ],
  output: {
    filename: '[name].[contenthash].js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
      rules: [
          // .css files are merged into <style></style> tag
          {
              test: /\.css$/,
              use: [
                  'style-loader',
                  'css-loader'
              ]
          }
      ]
  }
};

module.exports = (env, argv) => {
  if (argv.mode === 'development') {
    config.devtool = 'source-map';
  }

  return config;
}