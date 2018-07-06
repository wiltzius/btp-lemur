const path = require("path");
const webpack = require('webpack');
const BundleTracker = require('webpack-bundle-tracker');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  context: __dirname,

  // entry point of our app. assets/js/index.js should require other js modules and dependencies it needs
  entry: './assets/js/index',

  output: {
    path: path.resolve('./assets/bundles/'),
    filename: "[name]-[hash].js"
  },

  plugins: [
    new BundleTracker({filename: './webpack-stats.json'}),
    // new UglifyJSPlugin({
    //   uglifyOptions: {
    //     ecma: 6,
    //     mangle: false,
    //     output: {
    //       beautify: true
    //     }
    //   }
    // })
  ],

  module: {
    rules: [
      {
        // to transform JSX into JS
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.css?$/,
        // exclude: /node_modules/,
        loader: ['css-loader', 'style-loader'],
      }
    ]
  },

  resolve: {
    modules: ['node_modules', 'bower_components'],
    extensions: ['.js', '.jsx']
  }
};
