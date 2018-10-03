require('dotenv').config()

const { VuetifyProgressiveModule } = require('vuetify-loader')
const VuetifyLoaderPlugin = require('vuetify-loader/lib/plugin')

const resolve = dir => require('path').join(__dirname, dir)

module.exports = {
  mode: 'universal',

  /*
  ** Headers of the page
  */
  head: {
    title: 'Daily Idea',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Daily Idea' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      {
        rel: 'stylesheet',
        href:
          'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons'
      }
    ]
  },

  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#FFFFFF' },

  /*
  ** Global CSS
  */
  css: ['~/assets/style/app.styl'],

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '@/plugins/vuetify',
    '@/plugins/vuex-cognito',
  ],

  /*
  ** Nuxt.js modules
  */
  modules: ['@nuxtjs/dotenv', 'nuxt-universal-storage'],

  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    plugins: [new VuetifyLoaderPlugin()],
    extend(config, ctx) {
      // Run ESLint on save
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }

      const urlLoader = config.module.rules.find(r => r.test.test('test.gif'))
      urlLoader.oneOf = []
      urlLoader.oneOf.push({
        test: /\.(png|jpe?g|gif)$/,
        resourceQuery: /vuetify-preload/,
        use: [
          'vuetify-loader/progressive-loader',
          {
            loader: 'url-loader',
            options: { limit: 8000 }
          }
        ]
      })
      urlLoader.oneOf.push(urlLoader.use[0])
      delete urlLoader.use

      const vueLoader = ctx.loaders.vue
      vueLoader.compilerOptions = {}
      vueLoader.compilerOptions['modules'] = [VuetifyProgressiveModule]
      vueLoader.transformAssetUrls = Object.assign(
        {},
        vueLoader.transformAssetUrls,
        {
          'v-card-media': 'src'
        }
      )
    },
    transpile: [/^vuetify/]
  }
}
