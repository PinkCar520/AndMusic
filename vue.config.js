const path = require("path");
function resolve(dir) {
  return path.join(__dirname, dir);
}
module.exports = {
  // 解决跨域问题
  devServer: {
    port: 8080, // 端口号，如果端口号被占用，会自动提升1
    host: "localhost",
    https: false,
    open: true,
    proxy: {
      "/api": {
        target: "http://127.0.0.1:3000", // 请求的第三方接口
        changeOrigin: true, //开启代理服务器，就会给你代理转发
        pathRewrite: {
          "^/api": "", // 就是将请求地址中的 /api 前缀替换成空的
        },
      },
    },
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
        symbolId: "icon-[name]",
      })
      .end();
  },
};
