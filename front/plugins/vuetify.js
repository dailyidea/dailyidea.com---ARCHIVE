import Vue from 'vue'
import Vuetify from 'vuetify/lib'

// Import icons a swell
import '@fortawesome/fontawesome-free/css/all.css' // Ensure you are using css-loader

Vue.use(Vuetify, {
  theme: {
    primary: '#35124e', // #E53935
    secondary: '#ffc51d', // #FFCDD2
    accent: 'white' // #3F51B5
  },
  iconfont: 'mdi' // 'md' || 'mdi' || 'fa' || 'fa4'
})
