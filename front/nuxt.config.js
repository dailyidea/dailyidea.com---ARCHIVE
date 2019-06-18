require('dotenv').config()
const path = require('path')
// const { VuetifyProgressiveModule } = require('vuetify-loader')

// const resolve = dir => path.join(__dirname, dir)

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
  // router: {
  //   base: '/dev/'
  // },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#FFFFFF' },

  /*
   ** Global CSS
   */
  css: ['~/assets/style/app.styl', 'vue-snotify/styles/material.css'],

  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    '@/plugins/vuetify',
    '@/plugins/vuex-cognito',
    '@/plugins/notifications',
    '@/plugins/dayjs',
    '@/plugins/vee-validate',
    '@/plugins/mixins'
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
    publicPath: process.env.S3_DOMAIN
      ? `https://${process.env.S3_DOMAIN}/`
      : undefined,
    transpile: ['vuetify/lib'],
    cache: true,
    // modern: true,
    extend(config, ctx) {
      config.plugins.push(new (require('vuetify-loader/lib/plugin'))())
      // Run ESLint on save
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          include: path.join(__dirname)
        })
      }

      // const urlLoader = config.module.rules.find(r => r.test.test('test.gif'))
      // urlLoader.oneOf = []
      // urlLoader.oneOf.push({
      //   test: /\.(png|jpe?g|gif)$/,
      //   resourceQuery: /vuetify-preload/,
      //   use: [
      //     'vuetify-loader/progressive-loader',
      //     {
      //       loader: 'url-loader',
      //       options: { limit: 8000 }
      //     }
      //   ]
      // })
      // urlLoader.oneOf.push(urlLoader.use[0])
      // delete urlLoader.use

      // const vueLoader = ctx.loaders.vue
      // vueLoader.compilerOptions = {}
      // vueLoader.compilerOptions['modules'] = [VuetifyProgressiveModule]
      // vueLoader.transformAssetUrls = Object.assign(
      //   {},
      //   vueLoader.transformAssetUrls,
      //   {
      //     'v-card-media': 'src'
      //   }
      // )
    }
  }
}
