const
  HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Chat For Github',
      favicon:'./favicon.ico',
      template: './src/client/template/index.ejs'
    }),
  ],
}
