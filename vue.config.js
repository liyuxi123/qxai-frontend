let { defineConfig } = require('@vue/cli-service')
//sql编辑器
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');


module.exports = defineConfig({
  transpileDependencies: true,
  lintOnSave: false, // 关闭eslint校验

      // 修改页面标题
  pages: {
    index: {
      entry: 'src/main.js',
      template: 'public/index.html',
      filename: 'index.html',
      title: '全息数据平台', // 在这里修改浏览器显示的名称
    }
  },

  // 配置跨域
  devServer: {
    port: 8090,// 指定端口号
    proxy: {
      // 新的百度 API 代理
      '/baidu-api': {
        target: 'https://aip.baidubce.com',
        changeOrigin: true,
        pathRewrite: { '^/baidu-api': '' },
      },
      //主程序 API 代理
       '/api':{
        target: 'http://192.168.66.120:6855/qxaillm',
        changeOrigin: true,
        pathRewrite: { '^/api': '' },   //注意这个！！！！！！！！！！！！！！！！！！！！
      },

      '/QxAIConsulation':{
        target: 'http://192.168.66.172:9101/api',
        changeOrigin: true,
        pathRewrite: { '^/QxAIConsulation':  '' },   //注意这个！！！！！！！！！！！！！！！！！！！！
      },



    }
  },

  //sql编辑器
    configureWebpack: {
    plugins: [
        // Monaco sql编辑器插件
      new MonacoWebpackPlugin({
        languages: ['sql'] // 指定需要加载的语言
      }),
    ],

       cache: {
      type: 'filesystem', // 启用文件系统缓存
    },
  },
  // 生产环境优化
  productionSourceMap: false, // 关闭生产环境的 source map
  parallel: true,



})
