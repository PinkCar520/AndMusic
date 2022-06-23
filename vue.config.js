const path = require("path");
function resolve(dir) {
  return path.join(__dirname, dir);
}
module.exports = {
  // 解决跨域问题
  devServer: {
    port: 8088, // 端口号，如果端口号被占用，会自动提升1
    host: 'localhost',
    https: false,
    open: true,
    proxy: {
      '/dev-api': {
        // 当请求是以 dev-api 开头的请求，都走代理
        target: 'http://localhost:8001',
        changeOrigin: true, //开启代理服务器，就会给你代理转发
        pathRewrite: {
          // /dev-api/db.json 最终会转发到 http://localhost:8001/db.json
          // '^/dev-api': '/',  // 就是将请求地址中的 /dev-api 前缀替换成空的
          '^/json': '/',  // 就是将请求地址中的 /dev-api 前缀替换成空的
        }
      }
    }
  },
  lintOnSave: false, // 关闭格式检查
  productionSourceMap: false, // 打包时不会生成 .map 文件，加快打包速度
  transpileDependencies: ["vuetify"],
  chainWebpack(config) {
    // set svg-sprite-loader
    // 第一步：让其他svg loader不要对src/assets/icons/svgs进行操作
    config.module
      .rule("svg")
      .exclude.add(resolve("src/assets/icons/svgs"))
      .end();
    // 第二步：使用svg-sprite-loader 对 src/assets/icons/svgs下的svg进行操作
    config.module
      .rule("icons")
      .test(/\.svg$/)
      .include.add(resolve("src/assets/icons/svgs"))
      .end()
      .use("svg-sprite-loader")
      .loader("svg-sprite-loader")
      //定义规则 使用时 <svg class="icon"> <use xlink:href="#icon-svg文件名"></use>  </svg>
      .options({
        symbolId: "icon-[name]"
      })
      .end();
  }
};