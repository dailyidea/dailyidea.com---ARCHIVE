<template>
  <auth-page>
    <validation-observer v-slot="{ valid, validated, handleSubmit }">
      <form class="mainForm" @submit.prevent="handleSubmit(signup)">
        <!-- Email Input Box -->
        <v-text-field-with-validation
          v-model="name"
          v-focus
          rules="required|max:100"
          name="Name"
          class="name"
          single-line
          flat
          placeholder="What is your name?"
          prepend-inner-icon="mdi-account-circle-outline"
        ></v-text-field-with-validation>

        <!-- Email Input Box -->
        <v-text-field-with-validation
          v-model="email"
          rules="required|email"
          class="email"
          name="Email"
          single-line
          flat
          placeholder="What is your email address?"
          prepend-inner-icon="mdi-email-outline"
        ></v-text-field-with-validation>

        <!-- Email Already Exists Message -->
        <div v-if="emailExistsMsg != ''" class="red--text smaller">
          {{ emailExistsMsg }}
        </div>

        <!-- Continue Button -->
        <v-btn
          type="submit"
          rounded
          block
          :disabled="!valid || !validated"
          class="mt-10"
          :loading="registerInProgress"
          @click="handleSubmit(signup)"
          >Continue
        </v-btn>

        <div class="text-center pt-6">
          <div class="muted smaller">
            Already have an account?
            <nuxt-link class="loginBtn" text to="/auth/login">Login</nuxt-link>
          </div>
        </div>
      </form>
    </validation-observer>
  </auth-page>
</template>

<script>
import { ValidationObserver } from 'vee-validate'
import AuthPage from '@/components/authPage/AuthPage'
import registerPageMixin from '@/plugins/registerPageMixin'
import VTextFieldWithValidation from '@/components/validation/VTextFieldWithValidation'

export default {
  name: 'Index',
  components: { VTextFieldWithValidation, AuthPage, ValidationObserver },
  mixins: [registerPageMixin]
}
</script>

<style lang="scss">
@import '~assets/style/common';

.mainForm {
  max-width: 420px;
  margin: auto;
  display: block;
  padding: 5px 20px;
}
</style>
