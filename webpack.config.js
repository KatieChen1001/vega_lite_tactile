const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');


module.exports = {
  mode: 'development', // or 'production'
  entry: './src/index.ts', // the main entry point of your application

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      // [FONT]
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'], // resolve these extensions
    fallback: {
      "path": require.resolve("path-browserify"),
      "crypto": require.resolve("crypto-browserify"),
      "stream": require.resolve("stream-browserify"),
      "buffer": require.resolve("buffer/"),
      "fs": false, // 'fs' is typically not needed in the browser and can often be safely ignored
    },
  },
  output: {
    filename: 'bundle.js', // the output bundle name
    path: path.resolve(__dirname, 'dist'), // output path
    publicPath: '/', // public path
  },
  devtool: 'inline-source-map', // enable sourcemaps for debugging
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'), // Serve files from the dist directory
    },
    compress: true, // Enable gzip compression
    port: 9000, // Default to port 9000
  },
  plugins: [
    new MonacoWebpackPlugin({
      languages: ['json'],
    }),
    new HtmlWebpackPlugin({
      title: 'My Vega-Lite Wrapper', // Optional, you can specify a title
      template: 'src/index.html', // Path to your template file
    }),
    new CopyPlugin({
      patterns: [
        { from: 'src/worker.js', to: 'worker.js' }, // Copy worker.js to dist directory
        { from: 'node_modules/liblouis-build/build-no-tables-utf32.js', to: 'lib/' },
        { from: 'node_modules/liblouis-build/build-no-tables-utf16.js', to: 'lib/' },
        { from: 'node_modules/liblouis/easy-api.js', to: 'lib/' },
        // Optionally, copy the tables directory if needed
        { from: 'node_modules/liblouis-build/tables/', to: 'lib/tables/' },
      ],
    }),
  ],
  externals: {
    // Exclude liblouis from bundling
    // 'liblouis-build': 'commonjs liblouis-build',
    // 'liblouis/easy-api': 'commonjs liblouis/easy-api',
    // 'liblouis/capi.js': 'commonjs liblouis/capi.js',
  },

};
