const 
  path = require("path"),
  CleanWebpackPlugin = require('clean-webpack-plugin'),
  webpack = require('webpack'),
  HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    'app': [
      './src/client/index.jsx'
    ],
    vender:[
      'react',
      'redux',
      'react-redux',
      'react-router',
    ]
  },
  output: {
    filename: "[name].[hash].js",
    chunkFilename:'[name].[chunkhash].js',
    path: path.join(__dirname, "dist"),
  },
  module: {
    rules:[
      {
        test: /\.less$/,
        use: [{
          loader: "style-loader"
        }
        , {
          loader: "css-loader"
        }
        , {
          loader: "less-loader", options: {
            strictMath: true,
            noIeCompat: true
          }
        }]
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_module|bower_components)/,
        loader:'babel-loader'
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new HtmlWebpackPlugin({
      title: 'react',
      favicon:'./favicon.ico',
      template: './src/client/template/index.ejs'
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: "vender",
      minChunks: function(module){
        return module.context && module.context.indexOf("node_modules") !== -1;
      },
      minChunks: Infinity,
    })
  ],
}