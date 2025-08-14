const path = require('path');

module.exports = {
  entry: './src/renderer/App.js',
  output: {
    path: path.resolve(__dirname, 'src/renderer/dist'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  resolve: {
    extensions: ['.js'],
    alias: {
      '@': path.resolve(__dirname, 'src/renderer')
    }
  },
  target: 'electron-renderer'
};

