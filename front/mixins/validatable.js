export default {
  name: 'validatable',

  data() {
    return {
      submitting: false
    }
  },

  methods: {
    async actionTrigger(actionFunc) {
      try {
        this.submitting = true
        await actionFunc()
      } finally {
        this.submitting = false
      }
    },
    async actionValidate(actionFunc) {
      const validateRes = await this.$validator.validateAll()
      if (validateRes) {
        await this.actionTrigger(actionFunc)
      } else {
        this.$scrollToFirstError()
      }
    }
  }
}
