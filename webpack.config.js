const 
  path = require("path"),
  CleanWebpackPlugin = require('clean-webpack-plugin'),
  webpack = require('webpack'),
  ManifestPlugin = require('webpack-manifest-plugin'),
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
      'react-router-dom',
    ]
  },
  output: {
    filename: "[name].[hash].js",
    chunkFilename:'[name].[chunkhash].js',
    path: path.join(__dirname, "dist"),
  },
  "resolve": {
    "alias": {
      "react": "preact-compat",
      "react-dom": "preact-compat"
    }
  },
  module: {
    rules:[
      {
        test: /(\.less|\.css)$/,
        use: [{
          loader: "style-loader"
        }
        , {
          loader: "css-loader"
        }
        , {
          loader: "less-loader"
        }]
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
         'file-loader'
        ]
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_module|bower_components)/,
        loader:'babel-loader'
      },
      {
        test: /\.json$/,
        loader: 'json-loader'
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(['dist']),
    new ManifestPlugin(),
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
    }),

  ],
}