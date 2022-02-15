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
  // configureWebpack: (config) => {
  // 	// 不取消console打印    
  //   config.optimization.minimizer[0].options.terserOptions.compress.drop_console = false;
  // }
}