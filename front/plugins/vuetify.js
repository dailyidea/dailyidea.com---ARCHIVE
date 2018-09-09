import Vue from 'vue'

import {
  Vuetify, // required
  VApp, // required
  VNavigationDrawer,
  VFooter,
  VToolbar,
  transitions
} from 'vuetify'
import { Ripple } from 'vuetify/es5/directives'

Vue.use(Vuetify, {
  components: {
    VApp,
    VNavigationDrawer,
    VFooter,
    VToolbar,
    transitions
  },
  directives: {
    Ripple
  }
})
