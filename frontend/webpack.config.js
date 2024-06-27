const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = {
  entry: './src/index.js', // Adjust entry point based on your project structure
  output: {
    path: path.resolve(__dirname, 'dist'), // Adjust output path as needed
    filename: 'bundle.js', // Adjust output filename as needed
    publicPath: '/', // Adjust publicPath if serving from a subdirectory
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html', // Adjust path to your HTML template
    }),
    new BundleAnalyzerPlugin(), // Optional: Analyze bundle size
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader', // Use babel-loader for transpiling JS/JSX
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      },
      // Add more rules for CSS, images, etc., as per your project needs
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
