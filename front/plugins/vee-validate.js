import { extend } from 'vee-validate'
import { required, max, email, min } from 'vee-validate/dist/rules.umd'
import { messages } from 'vee-validate/dist/locale/en.json'

extend('required', {
  ...required,
  message: 'This field is required.'
})
extend('email', {
  ...email,
  message: 'This field must be valid email'
})
extend('max', {
  ...max,
  message: messages.max
})
extend('min', {
  ...min,
  message: messages.min
})
