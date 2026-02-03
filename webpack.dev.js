const path = require('path');
const common = require('./webpack.common.js');
const { merge } = require('webpack-merge');

module.exports = merge(common, {
  mode: 'development',

  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },

  devServer: {
    static: [
      // ⬇️ DIST (HTML hasil build)
      {
        directory: path.resolve(__dirname, 'dist'),
      },

      // ⬇️ AGAR sw.js BISA DIAKSES DI ROOT (/sw.js)
      {
        directory: path.resolve(__dirname, 'src/scripts'),
        publicPath: '/',
      },
    ],

    host: '127.0.0.1', // ✅ PENTING (kamera & secure context)
    port: 9000,

    open: true,
    hot: true,

    historyApiFallback: true, // ✅ WAJIB UNTUK SPA (#/route)

    client: {
      overlay: {
        errors: true,
        warnings: true,
      },
    },
  },
});
