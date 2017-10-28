const
  HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Chatroom',
      favicon:'./favicon.ico',
      template: './src/client/template/index.ejs',
      inject: true, //允许插件修改哪些内容，包括head与body
      hash: true, //为静态资源生成hash值
      minify: { //压缩HTML文件
        removeComments: true, //移除HTML中的注释
        collapseWhitespace: true //删除空白符与换行符
      }
    }),
  ],
}
