const path = require('path')
const webpack = require('webpack')
const dotenv = require('dotenv')

if (process.env.BUILD_ENV !== 'production') {
  dotenv.config()
}

const plugins = [
  new webpack.DefinePlugin({
    PLUGIN_NAME: JSON.stringify(process.env.PLUGIN_NAME),
    BACKEND_URL: JSON.stringify(process.env.BACKEND_URL)
  })
]

module.exports = {
  mode: process.env.BUILD_ENV === 'production' ? 'production' : 'development',
  entry: {
    client: path.join(__dirname, './src/index.js')
  },
  output: {
    path: path.resolve(__dirname, 'dist', 'public'),
    filename: '[name].js',
    publicPath: '/'
  },
  plugins,
  module: {
    rules:[{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader'
    }]
  },
  resolve:{
    extensions: [
      '.js'
    ]
  }
}
