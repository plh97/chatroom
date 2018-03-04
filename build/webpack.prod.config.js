const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  mode: 'production',
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Github - 聊天室',
      favicon: './favicon.png',
      template: './assets/template/index.ejs',
      minify: {
        removeComments: true,
        collapseWhitespace: true,
      },
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('pro'),
    }),
  ],
};
