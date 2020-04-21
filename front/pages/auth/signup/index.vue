<template>
  <auth-page>
    <form class="mainForm" @submit.prevent="signup">
      <!-- Email Input Box -->
      <v-text-field
        v-model="name"
        v-validate="'required|max:100'"
        :error-messages="errors.collect('name')"
        data-vv-name="name"
        class="name"
        single-line
        flat
        placeholder="What is your name?"
        prepend-inner-icon="mdi-account-circle-outline"
      ></v-text-field>

      <!-- Email Input Box -->
      <v-text-field
        v-model="email"
        v-validate="'required|email'"
        class="email"
        :error-messages="errors.collect('email')"
        data-vv-name="email"
        single-line
        flat
        placeholder="What is your email address?"
        prepend-inner-icon="mdi-email-outline"
      ></v-text-field>

      <!-- Email Already Exists Message -->
      <div v-if="emailExistsMsg != ''" class="red--text smaller">
        {{ emailExistsMsg }}
      </div>

      <!-- Continue Button -->
      <v-btn
        type="submit"
        rounded
        block
        class="mt-10"
        :loading="registerInProgress"
        @click="signup"
        >Continue
      </v-btn>

      <div class="text-center pt-6">
        <div class="muted smaller">
          Already have an account?
          <nuxt-link class="loginBtn" text to="/auth/login">Login</nuxt-link>
        </div>
      </div>
    </form>
  </auth-page>
</template>

<script>
import AuthPage from '@/components/authPage/AuthPage'
import registerPageMixin from '@/plugins/registerPageMixin'

export default {
  name: 'Index',
  components: { AuthPage },
  mixins: [registerPageMixin]
}
</script>

<style scoped lang="scss">
@import '~assets/style/common';

.mainForm {
  max-width: 420px;
  margin: auto;
  display: block;
  padding: 5px 20px;
}

form ::v-deep .v-input__prepend-inner {
  padding-right: 15px !important;
  i {
    font-size: 18px;
    color: $primary-color;
  }
}
</style>
