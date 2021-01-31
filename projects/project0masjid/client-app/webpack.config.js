const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require("path");
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = (env, argv) => {
  const devMode = argv.mode === 'development';

  const config = {
    entry: {
      index: './src/js/views/index.js',
      about: './src/js/views/about.js',
      contact: './src/js/views/contact.js'
    },
    plugins: [
      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: './src/html/index.html',
        chunks: ['index']
      }),
      new HtmlWebpackPlugin({
        title: 'About',
        filename: 'about.html',
        template: './src/html/about.html',
        chunks: ['about']
      }),
      new HtmlWebpackPlugin({
        title: 'Contact Us',
        filename: 'contact-us.html',
        template: './src/html/contact-us.html',
        chunks: ['contact']

      }),
      new CopyWebpackPlugin({
        patterns: [{
          from: `${__dirname}/src/images`
        }]
      }),
      new MiniCssExtractPlugin({
        filename: devMode ? '[name].css' : '[name].[hash].css',
        chunkFilename: devMode ? '[id].css' : '[id].[hash].css',
      })
    ],
    output: {
      filename: '[name].[contenthash].js',
      path: path.resolve(__dirname, 'dist'),
    },
    module: {
      rules: [
        {
          // Only run `.js` files through Babel
          test: /\.m?js$/,
          exclude: /(node_modules)/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                ['@babel/preset-env', { useBuiltIns: 'usage' }]
              ]
            }
          }
        },
        {
          test: /\.css$/,
          use: [
            {
              // Extract stylev2.css into separate file and automatically add <link href="main.css" rel="stylesheet">
              loader: MiniCssExtractPlugin.loader,
              options: {

                // MiniCssExtractPlugin use hot module replacement when in development
                hmr: devMode,
              }
            },
            'css-loader',
          ]
        }
      ]
    }
  };

  if (devMode) {
    config.devtool = 'source-map';
  }

  return config;
}