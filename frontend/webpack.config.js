const path = require('path');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = {
  entry: './src/index.js', // Adjust this based on your project structure
  output: {
    path: path.resolve(__dirname, 'dist'), // Adjust output path as needed
    filename: 'bundle.js', // Adjust output filename as needed
    publicPath: '/', // Adjust publicPath if serving from a subdirectory
  },
  plugins: [
    new BundleAnalyzerPlugin(), // Add BundleAnalyzerPlugin for analyzing bundle size
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader', // Add Babel loader for JSX and ES6
        },
      },
      // Add more loaders as per your project needs (e.g., for CSS, images)
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'], // Add other extensions your project uses
  },
  devServer: {
    contentBase: './dist', // Adjust contentBase based on your project structure
    hot: true, // Enable hot module replacement if needed
  },
};
