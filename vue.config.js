const IS_PROD = ["production", "prod"].includes(process.env.NODE_ENV);

const CompressionWebpackPlugin = require("compression-webpack-plugin");
const productionGzipExtensions = /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i;
const autoprefixer = require("autoprefixer");
const pxtorem = require("postcss-pxtorem");

const path = require("path");

function resolve(dir) {
  return path.join(__dirname, dir);
}

// cdn预加载使用
const externals = {
  vue: "Vue",
  "vue-router": "VueRouter",
  vuex: "Vuex",
  axios: "axios",
  "js-cookie": "Cookies",
  nprogress: "NProgress",
  vant: "Vant",
};

const cdn = {
  // 开发环境
  dev: {
    css: [
      "https://cdn.jsdelivr.net/npm/vant@2.4.1/lib/index.css",
      "https://unpkg.com/animate.css@3.5.2/animate.min.css",
      "//netdna.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css",
      "https://cdnjs.cloudflare.com/ajax/libs/nprogress/0.2.0/nprogress.min.css",
    ],
    js: [],
  },
  // 生产环境
  build: {
    css: [
      "https://unpkg.com/animate.css@3.5.2/animate.min.css",
      "//netdna.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css",
      "https://cdnjs.cloudflare.com/ajax/libs/nprogress/0.2.0/nprogress.min.css",
      "https://cdn.jsdelivr.net/npm/vant@2.4.1/lib/index.css",
    ],
    js: [
      "//cdnjs.cloudflare.com/ajax/libs/vue/2.6.10/vue.min.js",
      "//cdnjs.cloudflare.com/ajax/libs/vue-router/3.0.1/vue-router.min.js",
      "//cdnjs.cloudflare.com/ajax/libs/vuex/3.0.1/vuex.min.js",
      "//cdnjs.cloudflare.com/ajax/libs/axios/0.18.0/axios.min.js",
      "https://cdnjs.cloudflare.com/ajax/libs/js-cookie/2.2.0/js.cookie.min.js",
      "https://cdnjs.cloudflare.com/ajax/libs/nprogress/0.2.0/nprogress.min.js",
      "https://cdn.jsdelivr.net/npm/vant@2.4.1/lib/vant.min.js",
    ],
  },
};

module.exports = {
  transpileDependencies: ["webpack-dev-server/client"],
  // 基本路径
  publicPath: './',
  // 输出文件目录
  outputDir: "dist",
  assetsDir: "",
  // eslint-loader 是否在保存的时候检查
  lintOnSave: false,
  runtimeCompiler: true, // 是否使用包含运行时编译器的 Vue 构建版本
  // 生产环境是否生成 sourceMap 文件
  productionSourceMap: false,

  chainWebpack: (config) => {
    /**
     * 添加CDN参数到htmlWebpackPlugin配置中， 详见public/index.html 修改
     */
    config.plugin("html").tap((args) => {
      if (process.env.NODE_ENV === "production") {
        // args[0].cdn = cdn.build;
      }
      if (process.env.NODE_ENV === "development") {
        // args[0].cdn = cdn.dev;
      }
      return args;
    });

    /* 添加分析工具*/
    if (process.env.NODE_ENV === "production") {
      if (process.env.npm_config_report) {
        config

          .plugin("webpack-bundle-analyzer")

          .use(require("webpack-bundle-analyzer").BundleAnalyzerPlugin)

          .end();
        // config.plugins.delete('prefetch')
      }
      config.plugin("html").tap((opts) => {
        opts[0].minify.removeComments = false;
        return opts;
      });
      config.plugins.delete("preload");
      config.plugins.delete("prefetch");
      // 压缩代码
      config.optimization.minimize(true);
      // 分割代码
      config.optimization.splitChunks({
        chunks: "all",
      });
    }
    config.resolve.alias
      .set("@", resolve("src"))
      .set("tim", resolve("src/tim.js"));
    // config.plugins.delete("prefetch");
    // config.plugin("prefetch").tap(options => {
    //   options[0].fileBlacklist = options[0].fileBlacklist || [];
    //   options[0].fileBlacklist.push(/myasyncRoute(.)+?\.js$/);
    //   return options;
    // });
    config.entry.app = ["babel-polyfill", "./src/main.js"];
    // 修复HMR
    config.resolve.symlinks(true);
  },

  configureWebpack: (config) => {
    if (IS_PROD) {
      const plugins = [];
      //开启 gzip 压缩
      plugins.push(
        new CompressionWebpackPlugin({
          filename: "[path].gz[query]",
          algorithm: "gzip",
          test: productionGzipExtensions,
          threshold: 10240,
          minRatio: 0.8,
        })
      );

      config.plugins = [...config.plugins, ...plugins];
    }
    const myConfig = {};
    if (process.env.NODE_ENV === "production") {
      // 1. 生产环境npm包转CDN
      // myConfig.externals = externals;
    }
    if (process.env.NODE_ENV === "development") {
      /**
       * 关闭host check，方便使用ngrok之类的内网转发工具
       */
      myConfig.devServer = {
        disableHostCheck: true,
      };
    }
    return myConfig;
  },

  parallel: require("os").cpus().length > 1,
  pwa: {},
  devServer: {
    // host: "localhost",
    port: 82, // 端口号
    https: false, // https:{type:Boolean}
    open: false, //配置自动启动浏览器
    publicPath: '/',
    // proxy: 'http://localhost:4000' // 配置跨域处理,只有一个代理
    // 配置多个代理
    proxy: {
      "/api": {
        // target: "http://show373api.vi5.cn",
        target: "http://donate.ydsdg.com/",
        ws: false,
        changeOrigin: true,
        pathRewrite: {
          "^/api": "/api",
        },
      },
    },
  },
  css: {
    sourceMap: false,
    extract: false,
    loaderOptions: {
      postcss: {
        plugins: [
          autoprefixer(),
          pxtorem({
            rootValue: 37.5,
            propList: ["*"],
          }),
        ],
      },
    },
  },

  // 第三方插件配置
  pluginOptions: {},
};
