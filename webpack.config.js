var path = require("path");
var webpack = require('webpack');
var BundleTracker = require('webpack-bundle-tracker');

module.exports = {
  context: __dirname,

  // entry point of our app. client/js/index.js should require other js modules and dependencies it needs
  entry: './client/js/index.js',

  output: {
      path: path.resolve('./client/bundles/'),
      filename: "[name]-[hash].js"
  },

  plugins: [
    new BundleTracker({filename: './webpack-stats.json'})
  ],

  module: {
    loaders: [
      {
        // to transform JSX into JS
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'react']
        }
      }
    ]
  },

  resolve: {
    modulesDirectories: ['node_modules', 'bower_components'],
    extensions: ['', '.js', '.jsx']
  }
};
