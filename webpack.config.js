var webpack = require('webpack');

module.exports = {
  mode: 'production',
  entry: [
      __dirname + '/src/App.jsx'
      ],
      module: {
        rules: [
          {
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
           // use: ['babel-loader']
           loader: 'babel-loader',
           query: {
            presets: ['es2015', 'react','stage-2']
           }
          }
        ]
      },
      resolve: {
        extensions: ['*', '.js', '.jsx']
      },
    output: {
    path: '/home/ubuntu/workspace/dist',
    filename: 'bundle.js'
  },
  plugins: [
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('development')
        }),
        new webpack.ProvidePlugin({
            "React": "react",
        }),
    ],
 
};