const path = require('path')
const loaders = require('./webpack.loaders')
const rootPath = path.join(__dirname, './client')

const config = {
  context: rootPath,
  entry: './index.js',
  output: {
    filename: 'public/application.js'
  },
  module: {
    rules: loaders
  }
}

module.exports = config
