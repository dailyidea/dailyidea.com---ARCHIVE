import VeeValidate from 'vee-validate'
import Vue from 'vue'

Vue.use(VeeValidate, {
  inject: false
})

const dictionary = {
  en: {
    messages: {
      required: () => 'This field is required.'
    }
  }
}

// Override and merge the dictionaries
VeeValidate.Validator.localize(dictionary)
