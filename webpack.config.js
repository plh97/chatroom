const
  path = require("path"),
  CleanWebpackPlugin = require('clean-webpack-plugin'),
  webpack = require('webpack'),
  ManifestPlugin = require('webpack-manifest-plugin'),
  ExtractTextPlugin = require('extract-text-webpack-plugin'),
  HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    'app': [
      './src/client/index.jsx'
    ],
    vender:[
      'react',
      'mobx',
      'mobx-react',
      'react-router-dom',
      'react-syntax-highlighter'
    ]
  },
  output: {
    filename: "[name].[hash].js",
    chunkFilename:'[name].[chunkhash].js',
    path: path.join(__dirname, "dist"),
  },
  // "resolve": {
  //   "alias": {
  //     "react": "preact-compat",
  //     "react-dom": "preact-compat"
  //   }
  // },
  module: {
    rules:[
      {
        test: /(\.less|\.css)$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'less-loader']
        })
      },{
        test: /\.(png|svg|jpg|gif)$/,
        use: [
         'file-loader'
        ]
      },{
        test: /\.(js|jsx)$/,
        exclude: /(node_module|bower_components)/,
        loader:'babel-loader'
      // },{
      //   test: /\.json$/,
      //   loader: 'json-loader'
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new ManifestPlugin(path.join('dist', 'manifest.json')),
    new HtmlWebpackPlugin({
      title: 'Chatroom',
      favicon:'./favicon.ico',
      template: './src/client/template/index.ejs',
      inject: true, //允许插件修改哪些内容，包括head与body
      hash: true, //为静态资源生成hash值
      minify: { //压缩HTML文件
        removeComments: true, //移除HTML中的注释
        collapseWhitespace: false //删除空白符与换行符
      }
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: "vender",
      minChunks: function(module){
        return module.context && module.context.indexOf("node_modules") !== -1;
      },
      minChunks: Infinity,
    }),
    new ExtractTextPlugin({
      filename:'index.[hash].css'
    })
  ],
}
