module.exports = {
  outputDir: 'dist',  //build输出目录
  assetsDir: 'assets', //静态资源目录（js, css, img）
  lintOnSave: false, //是否开启eslint
  devServer: {
    open: false,
    // 跨域
    proxy: {
      '/api': {
        target: 'http://iwenwiki.com:3000/',
        changeOrigin: true,
        pathRewrite: {
          "^/api": ""
        }
      }
    }
  },
  configureWebpack: {
  	externals: {
      moment: {
        commonjs: 'moment',
        amd: 'moment',
        commonjs2: 'moment'
      }
    },
  }
}