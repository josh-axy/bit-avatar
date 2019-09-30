module.exports = {
  /** 区分打包环境与开发环境
   * process.env.NODE_ENV==='production'  (打包环境)
   * process.env.NODE_ENV==='development' (开发环境)
   * baseUrl: process.env.NODE_ENV==='production'?"https://cdn.didabisai.com/front/":'front/',
   */

  /**
   * 项目部署的基础路径
   *
   * 我们默认假设你的应用将会部署在域名的根部,
   * 例如 https://www.my-app.com/
   *
   * 如果你的应用部署在一个子路径下，那么你需要在这里
   * 指定子路径。
   *
   * 比如将你的应用部署在 https://www.foobar.com/my-app/
   * 那么将这个值改为 '/my-app/'
   */
  publicPath: '/bit/',

  // where to put static assets (js/css/img/font/...) // 是否在保存时使用‘eslint-loader’进行检查 // 有效值: true | false | 'error' // 当设置为‘error’时，检查出的错误会触发编译失败
  lintOnSave: true,

  // babel-loader默认会跳过`node_modules`依赖. // 通过这个选项可以显示转译一个依赖
  // transpileDependencies: [
  //   /* string or regex */
  // ],

  // 是否为生产环境构建生成sourceMap?
  productionSourceMap: false,

  // PWA 插件相关配置 // see https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-pwa
  pwa: {},

  // configure webpack-dev-server behavior
  devServer: {
    // open: process.platform === "darwin",

    // disableHostCheck: false,

    // host: "192.168.2.57",

    port: 9000,

    https: false,

    // hotOnly: false,

    // See https://github.com/vuejs/vue-cli/blob/dev/docs/cli-service.md#configuring-proxy
    proxy: {
      '/api': {
        target: 'http://host.laotiehui.cc',
        // 在本地会创建一个虚拟服务端，然后发送请求的数据，并同时接收请求的数据，这样服务端和服务端进行数据的交互就不会有跨域问题
        changeOrigin: true,
        // secure: true,
        // ws: true,
        // pathRewrite: {
        //   // 替换target中的请求地址，也就是说以后你在请求http://api.jisuapi.com/XXXXX这个地址的时候直接写成/api即可
        //   '^/api': '/bit'
        // }
      }
    }

    // string | Object

    // before: app => {}
  },

  // 第三方插件配置
  pluginOptions: {
    // ...
  }
};
