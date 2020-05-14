// const { VuetifyProgressiveModule } = require('vuetify-loader')
const path = require('path')
module.exports = {
  mode: 'universal',

  /*
   ** Headers of the page
   */
  head: {
    title: 'Daily Idea',
    meta: [
      {
        charset: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        hid: 'description',
        name: 'description',
        content: 'Daily Idea',
      },
    ],
    link: [
      {
        rel: 'icon',
        type: 'image/x-icon',
        href: '/favicon.ico',
      },
      {
        rel: 'stylesheet',
        href:
          'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons',
      },
    ],
  },
  // router: {
  //   base: '/dev/'
  // },
  /*
   ** Customize the progress-bar color
   */
  loading: {
    color: '#35124e',
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
    '@/plugins/toRelativeDate',
    '@/plugins/mixins',
    '@/plugins/app-dialog',
  ],

  /*
   ** Nuxt.js modules
   */
  modules: ['@nuxtjs/vuetify', 'nuxt-universal-storage', '@nuxtjs/sentry'],

  vuetify: {
    icons: {
      iconfont: 'md',
    },
    theme: {
      themes: {
        light: {
          primary: '#5B41BB',
          accent: '#FFFFFF',
          secondary: '#ffc61e',
          info: '#35124e',
          warning: '#ffb300',
          error: '#B71C1C',
          success: '#2E7D32',
        },
        dark: {
          primary: '#5B41BB',
          accent: '#FFFFFF',
          secondary: '#ffc61e',
          info: '#35124e',
          warning: '#ffb300',
          error: '#B71C1C',
          success: '#2E7D32',
        },
      },
    },
  },

  render: {
    bundleRenderer: {
      runInNewContext: false,
    },
  },

  /*
   ** Build configuration
   */
  build: {
    loaders: {
      scss: {
        prependData: `@import "~@/assets/style/variables.scss";`,
      },
      vue: {
        transformAssetUrls: {
          video: 'src',
          source: 'src',
          object: 'src',
          embed: 'src',
          'v-app-bar': 'src',
          // v-carousel-item extends v-img
          'v-carousel-item': ['src', 'lazy-src'],
          'v-img': ['src', 'lazy-src'],
          'v-navigation-drawer': 'src',
          'v-parallax': 'src',
          'v-toolbar': 'src',
        },
      },
    },
    /*
     ** You can extend webpack config here
     */
    publicPath: process.env.S3_DOMAIN
      ? `https://${process.env.S3_DOMAIN}/`
      : undefined,
    cache: true,
    modern: true,
    sourceMap: true,
    extend(config, ctx) {
      // Run ESLint on save
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          include: path.join(__dirname),
        })
      }
    },
  },
  sentry: {
    release: process.env.STAGE === 'prod',
    publishRelease: !!parseInt(process.env.SENTRY_PUBLISH_RELEASE),
  },
  env: {
    NODE_ENV: process.env.NODE_ENV,
    COGNITO_POOL_ID: process.env.COGNITO_POOL_ID,
    COGNITO_IDENTITY_POOL_ID: process.env.COGNITO_IDENTITY_POOL_ID,
    COGNITO_POOL_WEB_CLIENT_ID: process.env.COGNITO_POOL_WEB_CLIENT_ID,
    AWS_REGION: process.env.AWS_REGION,
    APPSYNC_ENDPOINT: process.env.APPSYNC_ENDPOINT,
    APPSYNC_API_KEY: process.env.APPSYNC_API_KEY,
    REQUEST_LOGIN_ENDPOINT: process.env.REQUEST_LOGIN_ENDPOINT,
    USER_UPLOADS_S3_DOMAIN: process.env.USER_UPLOADS_S3_DOMAIN,
  },
}
