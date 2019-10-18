require('dotenv').config()
// const { VuetifyProgressiveModule } = require('vuetify-loader')
const path = require('path')
// const resolve = dir => path.join(__dirname, dir)

module.exports = {
  mode: 'universal',

  /*
   ** Headers of the page
   */
  head: {
    title: 'Daily Idea',
    meta: [{
        charset: 'utf-8'
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1'
      },
      {
        hid: 'description',
        name: 'description',
        content: 'Daily Idea'
      }
    ],
    link: [{
        rel: 'icon',
        type: 'image/x-icon',
        href: '/favicon.ico'
      },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons'
      }
    ]
  },
  // router: {
  //   base: '/dev/'
  // },
  /*
   ** Customize the progress-bar color
   */
  loading: {
    color: '#FFFFFF'
  },

  /*
   ** Global CSS
   */
  css: ['vue-snotify/styles/material.css'],

  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    '@/plugins/vuex-cognito',
    '@/plugins/notifications',
    '@/plugins/dayjs',
    '@/plugins/clipboard',
    '@/plugins/vee-validate',
    '@/plugins/mixins',
    {
      src: '~plugins/vue-trix',
      ssr: false
    }
  ],

  /*
   ** Nuxt.js modules
   */
  modules: ['@nuxtjs/dotenv', '@nuxtjs/vuetify', 'nuxt-universal-storage'],

  vuetify: {
    icons: {
      iconfont: 'md'
    },
    theme: {
      themes: {
        light: {
          primary: '#35124e',
          accent: '#FFFFFF',
          secondary: '#424242',
          info: '#35124e',
          warning: '#ffb300',
          error: '#B71C1C',
          success: '#2E7D32'
        },
        dark: {
          primary: '#35124e',
          accent: '#FFFFFF',
          secondary: '#424242',
          info: '#35124e',
          warning: '#ffb300',
          error: '#B71C1C',
          success: '#2E7D32'
        }
      }
    }
  },

  render: {
    bundleRenderer: {
      runInNewContext: false
    }
  },

  /*
   ** Build configuration
   */
  build: {
    loaders: {
      scss: {
        prependData: `@import "~@/assets/style/variables.scss";`
      }
    },
    /*
     ** You can extend webpack config here
     */
    publicPath: process.env.S3_DOMAIN ?
      `https://${process.env.S3_DOMAIN}/` : undefined,
    cache: true,
    modern: true,
    extend(config, ctx) {
      // Run ESLint on save
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          include: path.join(__dirname)
        })
      }
    }
  }
}
