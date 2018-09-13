import Vue from 'vue'

import {
  Vuetify, // required
  VApp, // required
  VNavigationDrawer,
  VFooter,
  VToolbar,
  VBtn,
  VGrid,
  VForm,
  VCard,
  VTextField,
  transitions
} from 'vuetify'
import { Ripple } from 'vuetify/es5/directives'

Vue.use(Vuetify, {
  components: {
    VApp,
    VNavigationDrawer,
    VFooter,
    VBtn,
    VGrid,
    VForm,
    VCard,
    VTextField,
    VToolbar,
    transitions
  },
  directives: {
    Ripple
  }
})
