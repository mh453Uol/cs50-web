const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require("path");

module.exports = (env, argv) => {
  const devMode = argv.mode === 'development';

  const config = {
    entry: './src/js/index.js',
    plugins: [
      new HtmlWebpackPlugin({
        template: './src/html/index.html',
      }),
      new HtmlWebpackPlugin({
        template: './src/html/prayertimes.html',
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
      rules: [{
        test: /\.css$/,
        use: [{
            // Extract stylev2.css into separate file and automatically add <link href="main.css" rel="stylesheet">
            loader: MiniCssExtractPlugin.loader,
            options: {

              // MiniCssExtractPlugin use hot module replacement when in development
              hmr: devMode,
            }
          },
          'css-loader',
        ]
      }]
    }
  };

  if (devMode) {
    config.devtool = 'source-map';
  }

  return config;
}