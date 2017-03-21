// ./node_modules/webpack/bin/webpack.js --colors
var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var nodeEnv = process.env.NODE_ENV;
var isProduction = nodeEnv === 'production';
var _ = require('lodash');


module.exports = {
  entry: [
    './assets/js/cabinet/new/index.js'
  ],
  output: {
    path: __dirname,
    filename: './app/assets/precompiled_assets/cabinet.js'
  },
  module: {
    loaders: [
      {
        test: /\.scss$/,
        loader: isProduction ?
          ExtractTextPlugin.extract('css-loader!autoprefixer-loader!sass-loader') :
          'style-loader!css-loader!autoprefixer-loader!sass-loader'
      },
      {
        test: /\.jade$/,
        loader: 'jade-loader'
      },
      {
        test: /\.html$/,
        loader: 'html-loader'
      },
      {
        test: /\.js$/,
        include: [
          path.resolve(__dirname, 'assets/js')
        ],
        exclude: /(assets\/js\/libs|assets\/js\/vendor|app\/node_modules)/,
        loader: 'babel-loader'
      },
      {
        test: /\.yml$/,
        loader: 'json-loader!yaml-loader'
      },
      {
        test: /\.(jpg|gif|png|svg|eot|woff|ttf)$/,
        loader: 'url-loader'
      }
    ]
  },
  resolve: {
    fallback: [
      path.resolve(__dirname, './assets/js/libs'),
      path.resolve(__dirname, './assets/js/vendor'),
      path.resolve(__dirname, './app/assets/images'),
      path.resolve(__dirname, './app/assets/fonts')
    ]
  },
  externals: {
    'cdn.angular': 'angular',
    'cdn.angular/angular-sanitize': 'angular',
    'cdn.angular/angular-resource': 'angular',
    'cdn.angular/angular-animate': 'angular',
    'cdn.jquery': 'jQuery',
    'cdn.jqueryui': 'jQuery'
  },
  plugins: _.compact([
    isProduction && new ExtractTextPlugin('./app/assets/precompiled_assets/cabinet.css'),
    isProduction && new webpack.optimize.UglifyJsPlugin()
  ])
};
