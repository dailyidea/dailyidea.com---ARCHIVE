<template>
  <!-- Popup - Share Via Email -->

  <v-dialog
    v-model="visible"
    content-class="sendLogInEmailDialog"
    persistent
    max-width="400px"
  >
    <div class="closeBtn">
      <v-icon text class="cancelIcon" size="18" @click="closeDialog"
        >fas fa-times</v-icon
      >
    </div>

    <!-- Popup Header -->
    <div class="header">
      <v-icon text class="shareIcon" size="60">fas fa-envelope</v-icon>
    </div>
    <div class="emailSentMessage">
      <span v-if="sendingEmail"
        >Sending another email to <strong>{{ email }}</strong
        >...</span
      >
      <span v-else>
        We've sent another login email to you at <strong>{{ email }}</strong
        >. Make sure the email address is spelled correctly, and try checking
        your spam or junk folder. Click <strong>Back to Log In</strong> and
        input correct email if you have mistaken.
      </span>
    </div>
    <form id="share-idea-without-login-form" @submit.prevent="sendEmail">
      <!-- Submit Buttons -->
      <div class="btnContainer">
        <v-btn class="cancelBtn" text @click="backToLogIn"
          >Back to Log In</v-btn
        >
        <v-btn
          type="submit"
          class="specialButton shareBtn"
          :loading="sendingEmail"
          :disabled="sendingEmail || blockSendAgainTime > 0"
          form="share-idea-without-login-form"
          @click="sendEmail"
          >{{ sendAgainText }}</v-btn
        >
      </div>
    </form>
  </v-dialog>
</template>

<script>
export default {
  name: 'ResendAuthEmail',
  props: {},
  data: () => ({
    sendingEmail: true,
    visible: false,
    email: '',
    sent: false,
    error: false,
    blockSendAgainTime: 0
  }),
  computed: {
    sendAgainText() {
      let msg = 'Send again'
      if (this.blockSendAgainTime > 0) {
        msg += ` ${this.blockSendAgainTime}`
      }
      return msg
    }
  },
  methods: {
    resetData() {
      this.sent = false
      this.error = false
    },
    open(email) {
      this.email = email
      this.sendingEmail = true
      this.visible = true
      this.sendEmail()
      return new Promise((resolve, reject) => {})
    },
    execDecreaseTimer() {
      this.blockSendAgainTime--
      if (this.blockSendAgainTime > 0) {
        setTimeout(this.execDecreaseTimer, 1000)
      }
    },
    async sendEmail() {
      this.sendingEmail = true
      try {
        await this.$amplifyApi.post('RequestLogin', '', {
          body: { email: this.email }
        })
        this.sent = true
        this.blockSendAgainTime = 31
        this.execDecreaseTimer()
      } catch (e) {
        this.error = true
      }
      this.sendingEmail = false
    },
    closeDialog(status) {
      this.visible = false
      this.resetData()
    },
    backToLogIn() {
      this.closeDialog()
      this.$router.push('/auth/login')
    }
  }
}
</script>

<style lang="scss">
.sendLogInEmailDialog {
  .emailSentMessage {
    text-align: justify;
    color: #777777;
  }
  padding: 15px 20px 20px 20px;
  background: white;

  .closeBtn {
    .cancelIcon {
      float: right;
    }
  }

  .header {
    text-align: center;
    margin-bottom: 20px;
    margin-top: 30px;

    .headlineText {
      margin: 20px 0px 20px 0px;
      font-size: 23px;
    }

    .cancelIcon {
      border: 1px solid red;
      float: right;
      padding-bottom: 10px;
    }
  }

  .shareIcon {
    color: rgba(255, 185, 45);
  }

  .btnContainer {
    margin-top: 20px;
    margin-bottom: 20px;
    text-align: right;
  }
}
</style>
