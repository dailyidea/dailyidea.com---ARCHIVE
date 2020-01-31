<template>
  <auth-page>
    <form class="mainForm" @submit.prevent="signup">
      <!-- Email Input Box -->
      <v-text-field
        v-model="name"
        v-validate="'required|max:100'"
        :error-messages="errors.collect('name')"
        data-vv-name="name"
        class="inputBox name"
        single-line
        flat
        label="Enter name"
        prepend-inner-icon="fas fa-user"
      ></v-text-field>

      <!-- Email Input Box -->
      <v-text-field
        v-model="email"
        v-validate="'required|email'"
        class="inputBox email"
        :error-messages="errors.collect('email')"
        data-vv-name="email"
        single-line
        flat
        label="Enter email"
        prepend-inner-icon="email"
      ></v-text-field>

      <!-- Email Already Exists Message -->
      <div v-if="emailExistsMsg != ''" class="emailExistsMsg">
        {{ emailExistsMsg }}
        <div>
          <v-btn to="/auth/login" text small color="#827C85"
            >Login instead?
          </v-btn>
        </div>
      </div>

      <!-- Continue Button -->
      <v-btn
        type="submit"
        large
        class="continueBtn"
        :loading="registerInProgress"
        @click="signup"
        >Continue
      </v-btn>
      <div class="accountExists">
        <div class="existsTitle">
          Already have an account?
          <nuxt-link class="loginBtn" text to="/auth/login">Login</nuxt-link>
        </div>
      </div>
    </form>
  </auth-page>
</template>

<script>
import nanoid from 'nanoid'
import AuthPage from '@/components/authPage/AuthPage'

export default {
  name: 'Index',
  components: { AuthPage },
  data: () => ({
    email: '',
    name: '',
    emailExistsMsg: '',
    registerInProgress: false
  }),
  $_veeValidate: {
    validator: 'new'
  },
  mounted() {
    this.$validator.localize('en', this.dictionary)
  },
  methods: {
    async signup() {
      try {
        this.emailExistsMsg = ''

        // Validate input fields
        const result = await this.$validator.validateAll()
        if (!result) {
          return
        }

        this.registerInProgress = true

        await this.$store.dispatch('cognito/registerUser', {
          username: this.email,
          password: nanoid(),
          attributes: {
            name: this.name
          }
        })
        await this.$amplifyApi.post('RequestLogin', '', {
          body: { email: this.email }
        })

        // Redirect to registeration success page
        this.$router.push({
          name: 'auth-signup-success',
          params: { email: this.email }
        })
      } catch (e) {
        // Handle email already registered
        if (e.code && e.code === 'UsernameExistsException') {
          this.registerInProgress = false
          this.emailExistsMsg =
            "Oops! It looks like there's already an account with that email address."
        }
      }
    }
  }
}
</script>

<style scoped lang="scss">
.mainForm {
  max-width: 420px;
  margin: auto;
  display: block;
  padding: 5px 20px;
}

.inputBox {
  margin: auto;

  ::v-deep .v-input__prepend-inner {
    padding-right: 15px !important;
    font-size: 12px;

    i {
      font-size: 18px;
    }
  }
}

.continueBtn {
  border-radius: 4px;
  margin-top: 7vh;
  width: 100%;
  letter-spacing: 1px;
}

.accountExists {
  text-align: center;
  margin-top: 6vh;

  .existsTitle {
    font-size: 14px;
    line-height: 1.57;
    color: #c8c7c7;

    .loginBtn {
      text-decoration: none;
    }
  }
}

.emailExistsMsg {
  text-align: center;
  width: 70%;
  margin: auto;
  max-width: 420px;
  color: #c8c7c7;
}
</style>
