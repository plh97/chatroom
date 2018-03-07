// package
const path = require('path');
const merge = require('webpack-merge');
const	CleanWebpackPlugin = require('clean-webpack-plugin');

// local
const devWebpackConfig = require('./build/webpack.dev.config');
const prodWebpackConfig = require('./build/webpack.prod.config');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = (env) => {
  return merge(env.NODE_ENV === 'dev' ? devWebpackConfig : prodWebpackConfig, {
    entry: {
      app: './src/client/index.jsx',
      vender: [
        'mobx',
        'react',
        'mobx-react',
        'react-router',
        'react-router-dom',
      ],
    },
    output: {
      filename: '[name].[hash].js',
      chunkFilename: '[name].[chunkhash].js',
      path: path.join(__dirname, 'dist'),
      publicPath: '/',
    },
    module: {
      rules: [{
        test: /(\.less|\.css)$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader', 'less-loader'],
        }),
      }, {
        test: /\.(png|svg|jpg|gif)$/,
        use: ['file-loader'],
      }, {
        test: /\.(js|jsx)$/,
        exclude: /(node_module|bower_components)/,
        loader: 'babel-loader',
        // },{
        //   test: /\.json$/,
        //   loader: 'json-loader'
      }, {
        test: /\.(woff|woff2|eot|ttf|otf)$/,
        use: ['file-loader'],
      }],
    },
    plugins: [
      new CleanWebpackPlugin(['dist']),
      new ExtractTextPlugin({
        filename: 'index.[hash].css',
      }),
    ],
    optimization: {
      splitChunks: {
        name: 'vendor',
      },
    },
  });
};
