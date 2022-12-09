const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  configureWebpack: {
    module: {
      rules: [
        {
          test: /\.md$/i,
          type: 'asset/source',
        },
      ],
    },
  },
  transpileDependencies: [
    'vuetify'
  ]
})
