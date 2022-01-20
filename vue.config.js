module.exports = {
  devServer: {
    proxy: {
      '/api': {
        // target: 'http://localhost:8888',
        target: 'http://39.106.49.0:8888',
        ws: true,
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  }
}
