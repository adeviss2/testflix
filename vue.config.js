const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,

  pluginOptions: {
    
  },
  pwa: {
    name: 'TestFlix Movies',
    themeColor: '#212529',
    theme_color: "#212529",
    "display": "standalone",
    "short_name": "TestFlix",
    "background_color": "#212529",
    start_url: "./",
    msTileColor: '#212529',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black',
  }
})
