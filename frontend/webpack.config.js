const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  entry: './api/index.js', // Adjust this to your entry file
  target: 'node',
  externals: [nodeExternals()],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      }
    ]
  }
};
