module.exports = {
  entry: './src/main.js',
  output: {
    path: __dirname,
    filename: 'app.js'
  },
  module: {
    loaders: [
      { test: /\.js$/,  loader: "babel-loader", exclude: /node_modules/ }
    ]
  }
};

