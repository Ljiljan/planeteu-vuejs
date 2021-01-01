const path = require('path')
 
module.exports = {
  lintOnSave: false,
  chainWebpack: config => {
    const types = ['vue-modules', 'vue', 'normal-modules', 'normal']
    types.forEach(type => addStyleResource(config.module.rule('less').oneOf(type)))
  },
  devServer: {
    proxy: 'http://localhost:8080'
  },
  publicPath: '/planeteu-vuejs/'
}
 
function addStyleResource (rule) {
  rule.use('style-resource')
    .loader('style-resources-loader')
    .options({
      patterns: [
                 path.resolve(__dirname,'./src/assets/css/global.less'),
      ],
    })
}