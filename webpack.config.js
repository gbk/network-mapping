var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: {
    popup: './src/popup/scripts/index',
    upload: './src/upload/scripts/index'
  },
  output: {
    path: path.join(__dirname, 'src'),
    filename: '[name].js'
  },
  plugins: [
    new ExtractTextPlugin('[name].css')
  ],
  module: {
    loaders: [
      {
        test: /\.less$/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader!less-loader')
      }
    ]
  }
};
