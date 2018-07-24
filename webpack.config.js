// package
const path = require('path');
const merge = require('webpack-merge');
const WorkboxPlugin = require('workbox-webpack-plugin');
const	CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

// local
const devWebpackConfig = require('./build/webpack.dev');
const prodWebpackConfig = require('./build/webpack.prod');


function resolve(dir) {
  return path.join(__dirname, '..', dir);
}

module.exports = env => merge(env.NODE_ENV === 'dev' ? devWebpackConfig : prodWebpackConfig, {
  context: __dirname,
  resolve: {
    extensions: ['.js', '.jsx', '.json'],
    alias: {
      '@': resolve('src'),
    },
  },
  entry: {
    app: './src/client/index.jsx',
    vender: [
      'mobx',
      'react',
      'mobx-react',
      'react-router',
      'react-router-dom',
      '@pengliheng/github-report',
      'prismjs',
      'lodash.debounce',
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
        use: ['css-loader', 'postcss-loader', 'less-loader'],
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
    new WorkboxPlugin.GenerateSW({
      clientsClaim: true,
      skipWaiting: true,
    }),
  ],
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          name: 'vender',
          chunks: 'initial',
          minChunks: 2,
        },
      },
    },
  },
});
