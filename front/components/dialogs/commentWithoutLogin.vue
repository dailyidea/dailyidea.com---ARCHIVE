<template>
  <v-dialog
    v-model="visible"
    content-class="commentWithoutLoginDialog"
    persistent
    max-width="500px"
  >
    <!-- Popup Header -->
    <div class="header">
      <v-icon text class="cancelIcon" size="20" @click="closeDialog()"
        >fas fa-times</v-icon
      >
    </div>

    <!-- Popup body -->
    <form>
      <div class="body">
        <!-- Form -->
        <div v-if="successMessage == ''">
          <div class="headerTitle">
            Oops,
          </div>
          <div class="subTitle">
            Verify your email or signin to post your comment.
          </div>

          <!-- Text Fields -->
          <div>
            <v-text-field
              v-model="form.email"
              v-validate="'required|email|max:100'"
              class="emailInput"
              single-line
              flat
              prepend-inner-icon="email"
              :error-messages="errors.collect('email')"
              data-vv-name="email"
              label="Enter email"
            ></v-text-field>
          </div>

          <!-- Submit Buttons -->
          <div class="specialButton submitBtn">
            <v-btn :loading="loginInProgress" @click="signup">SEND</v-btn>
          </div>
        </div>

        <!-- Success Message -->
        <div v-else>
          <div class="headerTitle">
            Check your inbox
          </div>
          <div class="subTitle">
            {{ successMessage }}
          </div>

          <!-- Submit Buttons -->
          <div class="specialButton submitBtn">
            <v-btn @click="closeDialog()">OKAY</v-btn>
          </div>
        </div>
      </div>
    </form>
  </v-dialog>
</template>

<script>
import nanoid from 'nanoid'
export default {
  $_veeValidate: {
    validator: 'new'
  },
  props: {
    // Show loggedin or loggedout header
    visible: {
      type: Boolean,
      default: true
    }
  },
  data: () => ({
    form: {
      email: ''
    },
    successMessage: '',
    loginInProgress: false
  }),
  methods: {
    async signup() {
      try {
        // Validate input fields
        let result = await this.$validator.validateAll()
        if (!result) {
          return
        }

        // Show button loader
        this.loginInProgress = true

        // Call register api
        debugger
        await this.$store.dispatch('cognito/registerUser', {
          username: this.form.email,
          password: nanoid(),
          attributes: {}
        })

        // Hide button loader
        this.loginInProgress = false
      } catch (e) {
        // Handle email already registered
        if (e.code && e.code == 'UsernameExistsException') {
          // If email has already registered, send login link instead.
          await this.$amplifyApi.post('RequestLogin', '', {
            body: { email: this.form.email }
          })

          // Show success message
          this.successMessage = `We've sent you a link on ${this.form.email}. Click that in your inbox to post the comment.`

          // Show button loader
          this.loginInProgress = false

          return
        }

        // If any other issue, show error message
        console.log('error', e)
        this.$snotify.error('Someting went wrong!', 'Error', {
          timeout: 2000,
          showProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true
        })

        // Show button loader
        this.loginInProgress = false
      }
    },
    closeDialog() {
      this.$emit('close')
      this.successMessage = ''
      this.form.email = ''
    }
  }
}
</script>

<style lang="scss">
.commentWithoutLoginDialog {
  padding: 40px 40px;
  background: white;
  width: 100%;
  max-width: 350px !important;
  position: relative;

  .cancelIcon {
    position: absolute;
    right: 10px;
    top: 10px;
  }

  .body {
    text-align: center;
    padding: 10px 0px;

    .headerTitle {
      padding-top: 20px;
      font-size: 28px;
    }
    .subTitle {
      padding: 10px 0px;
      font-size: 16px;
      color: $accent-color;
    }
    .emailInput {
      padding-top: 20px;
      margin: 0px;
      .v-icon {
        font-size: 18px;
      }
    }
    .submitBtn {
      padding-top: 30px;
      button {
        width: 100%;
      }
    }
  }
}
</style>
