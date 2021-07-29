const plugins = [];
// 生产环境移除console
if (['production', 'prod'].includes(process.env.NODE_ENV)) {
  plugins.push("transform-remove-console")
}
var vant = ['import', {
  libraryName: 'vant',
  libraryDirectory: 'es',
  style: true
}, 'vant'];

var mand=["import", {
  "libraryName": "mand-mobile",
  "libraryDirectory": "lib"
}]


plugins.push(vant);
plugins.push(mand)
plugins.push([
  'component',
  {
    libraryName: 'element-ui',
    styleLibraryName: 'theme-chalk'
  }
])
module.exports = {
  presets: [
    [
      "@vue/app",
      {
        "useBuiltIns": "entry",
        polyfills: [
          'es6.promise',
          'es6.symbol'
        ]
      }
    ]
  ],
  ignore: ['sdk/**'],
  plugins: plugins
};