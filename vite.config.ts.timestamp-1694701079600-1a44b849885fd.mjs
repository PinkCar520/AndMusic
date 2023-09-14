// vite.config.ts
import { defineConfig } from "file:///D:/Jim/Test/and-music_vue/node_modules/vite/dist/node/index.js";
import { createSvgIconsPlugin } from "file:///D:/Jim/Test/and-music_vue/node_modules/vite-plugin-svg-icons/dist/index.mjs";
import path from "path";
import postcsspxtoviewport from "file:///D:/Jim/Test/and-music_vue/node_modules/postcss-px-to-viewport/index.js";
import vue from "file:///D:/Jim/Test/and-music_vue/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import AutoImport from "file:///D:/Jim/Test/and-music_vue/node_modules/unplugin-auto-import/dist/vite.js";
import Components from "file:///D:/Jim/Test/and-music_vue/node_modules/unplugin-vue-components/dist/vite.mjs";
import { ElementPlusResolver } from "file:///D:/Jim/Test/and-music_vue/node_modules/unplugin-vue-components/dist/resolvers.mjs";
var __vite_injected_original_dirname = "D:\\Jim\\Test\\and-music_vue";
var vite_config_default = defineConfig({
  plugins: [
    vue(),
    createSvgIconsPlugin({
      // 指定需要缓存的图标文件夹
      iconDirs: [path.resolve(process.cwd(), "src/icons")],
      // 指定symbolId格式
      symbolId: "icon-[dir]-[name]",
      // inject?: "body-last" | "body-first",
      customDomId: "__svg__icons__dom__"
    }),
    AutoImport({
      resolvers: [ElementPlusResolver()]
    }),
    Components({
      resolvers: [ElementPlusResolver()]
    })
  ],
  server: {
    open: true,
    port: 5173,
    proxy: {
      "/api": {
        target: "http://127.0.0.1:3000/",
        changeOrigin: true,
        rewrite: (path2) => path2.replace(/^\/api/, "")
      }
    }
  },
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "src")
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '@import "@/assets/styles/main.scss";'
      }
    },
    postcss: {
      plugins: [
        postcsspxtoviewport({
          unitToConvert: "px",
          // 要转化的单位
          viewportWidth: 1440,
          // UI设计稿的宽度
          unitPrecision: 6,
          // 转换后的精度，即小数点位数
          propList: ["*"],
          // 指定转换的css属性的单位，*代表全部css属性的单位都进行转换
          viewportUnit: "vw",
          // 指定需要转换成的视窗单位，默认vw
          fontViewportUnit: "vw",
          // 指定字体需要转换成的视窗单位，默认vw
          selectorBlackList: ["wrap"],
          // 指定不转换为视窗单位的类名，
          minPixelValue: 1,
          // 默认值1，小于或等于1px则不进行转换
          mediaQuery: true,
          // 是否在媒体查询的css代码中也进行转换，默认false
          replace: true,
          // 是否转换后直接更换属性值
          exclude: [/node_modules/],
          // 设置忽略文件，用正则做目录名匹配
          landscape: false
          // 是否处理横屏情况
        })
      ]
    }
  },
  build: {
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        chunkFileNames: "js/[name]-[hash].js",
        entryFileNames: "js/[name]-[hash].js",
        assetFileNames: "[ext]/[name]-[hash].[ext]"
        // manualChunks: {
        //   "group-other": ["./src/pages/Playlist.vue"],
        //   "group-base": ["./src/pages/Discover.vue", "./src/pages/Home.vue"],
        // },
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxKaW1cXFxcVGVzdFxcXFxhbmQtbXVzaWNfdnVlXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJEOlxcXFxKaW1cXFxcVGVzdFxcXFxhbmQtbXVzaWNfdnVlXFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi9KaW0vVGVzdC9hbmQtbXVzaWNfdnVlL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcbmltcG9ydCB7IGNyZWF0ZVN2Z0ljb25zUGx1Z2luIH0gZnJvbSBcInZpdGUtcGx1Z2luLXN2Zy1pY29uc1wiO1xuaW1wb3J0IHBhdGggZnJvbSBcInBhdGhcIjtcbmltcG9ydCBwb3N0Y3NzcHh0b3ZpZXdwb3J0IGZyb20gXCJwb3N0Y3NzLXB4LXRvLXZpZXdwb3J0XCI7XG5pbXBvcnQgdnVlIGZyb20gXCJAdml0ZWpzL3BsdWdpbi12dWVcIjtcbi8vIFx1NjMwOVx1OTcwMFx1ODFFQVx1NTJBOFx1NUJGQ1x1NTE2NVxuaW1wb3J0IEF1dG9JbXBvcnQgZnJvbSBcInVucGx1Z2luLWF1dG8taW1wb3J0L3ZpdGVcIjtcbmltcG9ydCBDb21wb25lbnRzIGZyb20gXCJ1bnBsdWdpbi12dWUtY29tcG9uZW50cy92aXRlXCI7XG5pbXBvcnQgeyBFbGVtZW50UGx1c1Jlc29sdmVyIH0gZnJvbSBcInVucGx1Z2luLXZ1ZS1jb21wb25lbnRzL3Jlc29sdmVyc1wiO1xuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBwbHVnaW5zOiBbXG4gICAgdnVlKCksXG4gICAgY3JlYXRlU3ZnSWNvbnNQbHVnaW4oe1xuICAgICAgLy8gXHU2MzA3XHU1QjlBXHU5NzAwXHU4OTgxXHU3RjEzXHU1QjU4XHU3Njg0XHU1NkZFXHU2ODA3XHU2NTg3XHU0RUY2XHU1OTM5XG4gICAgICBpY29uRGlyczogW3BhdGgucmVzb2x2ZShwcm9jZXNzLmN3ZCgpLCBcInNyYy9pY29uc1wiKV0sXG4gICAgICAvLyBcdTYzMDdcdTVCOUFzeW1ib2xJZFx1NjgzQ1x1NUYwRlxuICAgICAgc3ltYm9sSWQ6IFwiaWNvbi1bZGlyXS1bbmFtZV1cIixcbiAgICAgIC8vIGluamVjdD86IFwiYm9keS1sYXN0XCIgfCBcImJvZHktZmlyc3RcIixcbiAgICAgIGN1c3RvbURvbUlkOiBcIl9fc3ZnX19pY29uc19fZG9tX19cIixcbiAgICB9KSxcbiAgICBBdXRvSW1wb3J0KHtcbiAgICAgIHJlc29sdmVyczogW0VsZW1lbnRQbHVzUmVzb2x2ZXIoKV0sXG4gICAgfSksXG4gICAgQ29tcG9uZW50cyh7XG4gICAgICByZXNvbHZlcnM6IFtFbGVtZW50UGx1c1Jlc29sdmVyKCldLFxuICAgIH0pLFxuICBdLFxuICBzZXJ2ZXI6IHtcbiAgICBvcGVuOiB0cnVlLFxuICAgIHBvcnQ6IDUxNzMsXG4gICAgcHJveHk6IHtcbiAgICAgIFwiL2FwaVwiOiB7XG4gICAgICAgIHRhcmdldDogXCJodHRwOi8vMTI3LjAuMC4xOjMwMDAvXCIsXG4gICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcbiAgICAgICAgcmV3cml0ZTogKHBhdGgpID0+IHBhdGgucmVwbGFjZSgvXlxcL2FwaS8sIFwiXCIpLFxuICAgICAgfSxcbiAgICB9LFxuICB9LFxuICByZXNvbHZlOiB7XG4gICAgYWxpYXM6IHtcbiAgICAgIFwiQFwiOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcInNyY1wiKSxcbiAgICB9LFxuICB9LFxuICBjc3M6IHtcbiAgICBwcmVwcm9jZXNzb3JPcHRpb25zOiB7XG4gICAgICBzY3NzOiB7XG4gICAgICAgIGFkZGl0aW9uYWxEYXRhOiAnQGltcG9ydCBcIkAvYXNzZXRzL3N0eWxlcy9tYWluLnNjc3NcIjsnLFxuICAgICAgfSxcbiAgICB9LFxuICAgIHBvc3Rjc3M6IHtcbiAgICAgIHBsdWdpbnM6IFtcbiAgICAgICAgcG9zdGNzc3B4dG92aWV3cG9ydCh7XG4gICAgICAgICAgdW5pdFRvQ29udmVydDogXCJweFwiLCAvLyBcdTg5ODFcdThGNkNcdTUzMTZcdTc2ODRcdTUzNTVcdTRGNERcbiAgICAgICAgICB2aWV3cG9ydFdpZHRoOiAxNDQwLCAvLyBVSVx1OEJCRVx1OEJBMVx1N0EzRlx1NzY4NFx1NUJCRFx1NUVBNlxuICAgICAgICAgIHVuaXRQcmVjaXNpb246IDYsIC8vIFx1OEY2Q1x1NjM2Mlx1NTQwRVx1NzY4NFx1N0NCRVx1NUVBNlx1RkYwQ1x1NTM3M1x1NUMwRlx1NjU3MFx1NzBCOVx1NEY0RFx1NjU3MFxuICAgICAgICAgIHByb3BMaXN0OiBbXCIqXCJdLCAvLyBcdTYzMDdcdTVCOUFcdThGNkNcdTYzNjJcdTc2ODRjc3NcdTVDNUVcdTYwMjdcdTc2ODRcdTUzNTVcdTRGNERcdUZGMEMqXHU0RUUzXHU4ODY4XHU1MTY4XHU5MEU4Y3NzXHU1QzVFXHU2MDI3XHU3Njg0XHU1MzU1XHU0RjREXHU5MEZEXHU4RkRCXHU4ODRDXHU4RjZDXHU2MzYyXG4gICAgICAgICAgdmlld3BvcnRVbml0OiBcInZ3XCIsIC8vIFx1NjMwN1x1NUI5QVx1OTcwMFx1ODk4MVx1OEY2Q1x1NjM2Mlx1NjIxMFx1NzY4NFx1ODlDNlx1N0E5N1x1NTM1NVx1NEY0RFx1RkYwQ1x1OUVEOFx1OEJBNHZ3XG4gICAgICAgICAgZm9udFZpZXdwb3J0VW5pdDogXCJ2d1wiLCAvLyBcdTYzMDdcdTVCOUFcdTVCNTdcdTRGNTNcdTk3MDBcdTg5ODFcdThGNkNcdTYzNjJcdTYyMTBcdTc2ODRcdTg5QzZcdTdBOTdcdTUzNTVcdTRGNERcdUZGMENcdTlFRDhcdThCQTR2d1xuICAgICAgICAgIHNlbGVjdG9yQmxhY2tMaXN0OiBbXCJ3cmFwXCJdLCAvLyBcdTYzMDdcdTVCOUFcdTRFMERcdThGNkNcdTYzNjJcdTRFM0FcdTg5QzZcdTdBOTdcdTUzNTVcdTRGNERcdTc2ODRcdTdDN0JcdTU0MERcdUZGMENcbiAgICAgICAgICBtaW5QaXhlbFZhbHVlOiAxLCAvLyBcdTlFRDhcdThCQTRcdTUwM0MxXHVGRjBDXHU1QzBGXHU0RThFXHU2MjE2XHU3QjQ5XHU0RThFMXB4XHU1MjE5XHU0RTBEXHU4RkRCXHU4ODRDXHU4RjZDXHU2MzYyXG4gICAgICAgICAgbWVkaWFRdWVyeTogdHJ1ZSwgLy8gXHU2NjJGXHU1NDI2XHU1NzI4XHU1QTkyXHU0RjUzXHU2N0U1XHU4QkUyXHU3Njg0Y3NzXHU0RUUzXHU3ODAxXHU0RTJEXHU0RTVGXHU4RkRCXHU4ODRDXHU4RjZDXHU2MzYyXHVGRjBDXHU5RUQ4XHU4QkE0ZmFsc2VcbiAgICAgICAgICByZXBsYWNlOiB0cnVlLCAvLyBcdTY2MkZcdTU0MjZcdThGNkNcdTYzNjJcdTU0MEVcdTc2RjRcdTYzQTVcdTY2RjRcdTYzNjJcdTVDNUVcdTYwMjdcdTUwM0NcbiAgICAgICAgICBleGNsdWRlOiBbL25vZGVfbW9kdWxlcy9dLCAvLyBcdThCQkVcdTdGNkVcdTVGRkRcdTc1NjVcdTY1ODdcdTRFRjZcdUZGMENcdTc1MjhcdTZCNjNcdTUyMTlcdTUwNUFcdTc2RUVcdTVGNTVcdTU0MERcdTUzMzlcdTkxNERcbiAgICAgICAgICBsYW5kc2NhcGU6IGZhbHNlLCAvLyBcdTY2MkZcdTU0MjZcdTU5MDRcdTc0MDZcdTZBMkFcdTVDNEZcdTYwQzVcdTUxQjVcbiAgICAgICAgfSksXG4gICAgICBdLFxuICAgIH0sXG4gIH0sXG4gIGJ1aWxkOiB7XG4gICAgY3NzQ29kZVNwbGl0OiBmYWxzZSxcbiAgICByb2xsdXBPcHRpb25zOiB7XG4gICAgICBvdXRwdXQ6IHtcbiAgICAgICAgY2h1bmtGaWxlTmFtZXM6IFwianMvW25hbWVdLVtoYXNoXS5qc1wiLFxuICAgICAgICBlbnRyeUZpbGVOYW1lczogXCJqcy9bbmFtZV0tW2hhc2hdLmpzXCIsXG4gICAgICAgIGFzc2V0RmlsZU5hbWVzOiBcIltleHRdL1tuYW1lXS1baGFzaF0uW2V4dF1cIixcbiAgICAgICAgLy8gbWFudWFsQ2h1bmtzOiB7XG4gICAgICAgIC8vICAgXCJncm91cC1vdGhlclwiOiBbXCIuL3NyYy9wYWdlcy9QbGF5bGlzdC52dWVcIl0sXG4gICAgICAgIC8vICAgXCJncm91cC1iYXNlXCI6IFtcIi4vc3JjL3BhZ2VzL0Rpc2NvdmVyLnZ1ZVwiLCBcIi4vc3JjL3BhZ2VzL0hvbWUudnVlXCJdLFxuICAgICAgICAvLyB9LFxuICAgICAgfSxcbiAgICB9LFxuICB9LFxufSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQXFRLFNBQVMsb0JBQW9CO0FBQ2xTLFNBQVMsNEJBQTRCO0FBQ3JDLE9BQU8sVUFBVTtBQUNqQixPQUFPLHlCQUF5QjtBQUNoQyxPQUFPLFNBQVM7QUFFaEIsT0FBTyxnQkFBZ0I7QUFDdkIsT0FBTyxnQkFBZ0I7QUFDdkIsU0FBUywyQkFBMkI7QUFScEMsSUFBTSxtQ0FBbUM7QUFVekMsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUztBQUFBLElBQ1AsSUFBSTtBQUFBLElBQ0oscUJBQXFCO0FBQUE7QUFBQSxNQUVuQixVQUFVLENBQUMsS0FBSyxRQUFRLFFBQVEsSUFBSSxHQUFHLFdBQVcsQ0FBQztBQUFBO0FBQUEsTUFFbkQsVUFBVTtBQUFBO0FBQUEsTUFFVixhQUFhO0FBQUEsSUFDZixDQUFDO0FBQUEsSUFDRCxXQUFXO0FBQUEsTUFDVCxXQUFXLENBQUMsb0JBQW9CLENBQUM7QUFBQSxJQUNuQyxDQUFDO0FBQUEsSUFDRCxXQUFXO0FBQUEsTUFDVCxXQUFXLENBQUMsb0JBQW9CLENBQUM7QUFBQSxJQUNuQyxDQUFDO0FBQUEsRUFDSDtBQUFBLEVBQ0EsUUFBUTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sTUFBTTtBQUFBLElBQ04sT0FBTztBQUFBLE1BQ0wsUUFBUTtBQUFBLFFBQ04sUUFBUTtBQUFBLFFBQ1IsY0FBYztBQUFBLFFBQ2QsU0FBUyxDQUFDQSxVQUFTQSxNQUFLLFFBQVEsVUFBVSxFQUFFO0FBQUEsTUFDOUM7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0wsS0FBSyxLQUFLLFFBQVEsa0NBQVcsS0FBSztBQUFBLElBQ3BDO0FBQUEsRUFDRjtBQUFBLEVBQ0EsS0FBSztBQUFBLElBQ0gscUJBQXFCO0FBQUEsTUFDbkIsTUFBTTtBQUFBLFFBQ0osZ0JBQWdCO0FBQUEsTUFDbEI7QUFBQSxJQUNGO0FBQUEsSUFDQSxTQUFTO0FBQUEsTUFDUCxTQUFTO0FBQUEsUUFDUCxvQkFBb0I7QUFBQSxVQUNsQixlQUFlO0FBQUE7QUFBQSxVQUNmLGVBQWU7QUFBQTtBQUFBLFVBQ2YsZUFBZTtBQUFBO0FBQUEsVUFDZixVQUFVLENBQUMsR0FBRztBQUFBO0FBQUEsVUFDZCxjQUFjO0FBQUE7QUFBQSxVQUNkLGtCQUFrQjtBQUFBO0FBQUEsVUFDbEIsbUJBQW1CLENBQUMsTUFBTTtBQUFBO0FBQUEsVUFDMUIsZUFBZTtBQUFBO0FBQUEsVUFDZixZQUFZO0FBQUE7QUFBQSxVQUNaLFNBQVM7QUFBQTtBQUFBLFVBQ1QsU0FBUyxDQUFDLGNBQWM7QUFBQTtBQUFBLFVBQ3hCLFdBQVc7QUFBQTtBQUFBLFFBQ2IsQ0FBQztBQUFBLE1BQ0g7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUFBLEVBQ0EsT0FBTztBQUFBLElBQ0wsY0FBYztBQUFBLElBQ2QsZUFBZTtBQUFBLE1BQ2IsUUFBUTtBQUFBLFFBQ04sZ0JBQWdCO0FBQUEsUUFDaEIsZ0JBQWdCO0FBQUEsUUFDaEIsZ0JBQWdCO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxNQUtsQjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFsicGF0aCJdCn0K
