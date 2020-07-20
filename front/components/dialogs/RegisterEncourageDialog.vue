<template>
  <validation-observer
    ref="validator"
    v-slot="{ valid, validated, handleSubmit }"
  >
    <default-dialog
      :value="value"
      :image-path="
        require('~/assets/images/dialogs/undraw_real_time_collaboration_c62i.svg')
      "
      header="Get The Best Ideas In Your Inbox"
      button-ok-text="Sign Up"
      :button-ok-disabled="!valid || !validated"
      :button-ok-loading="registerInProgress"
      @ok="handleSubmit(signup)"
      @input="v => $emit('input', v)"
      @cancel="() => $emit('input', false)"
    >
      <p>
        We'll compile the best ideas from all over the internet and send them to
        you.
      </p>
      <p>
        Additionally, you'll be able to:
      </p>
      <ul class="benefits">
        <li>
          <i class="fa fa-check"></i> Save the current post and return to it
          later
        </li>
        <li><i class="fa fa-check"></i> Follow certain users</li>
        <li><i class="fa fa-check"></i> Post your own ideas</li>
      </ul>

      <!-- form -->
      <form @submit.stop.prevent="handleSubmit(signup)">
        <v-text-field-with-validation
          v-model="name"
          rules="required|max:100"
          name="Name"
          label="Your name"
          single-line
          flat
          placeholder="Your Name"
          prepend-inner-icon="mdi-account-circle-outline"
        ></v-text-field-with-validation>
        <v-text-field-with-validation
          v-model="email"
          rules="required|email"
          name="Email"
          single-line
          flat
          label="Your Email"
          placeholder="Your Email"
          prepend-inner-icon="mdi-email-outline"
        ></v-text-field-with-validation>
      </form>

      <!-- Email Already Exists Message -->
      <div v-if="emailExistsMsg != ''" class="emailExistsMsg">
        {{ emailExistsMsg }}
        <div>
          <v-btn to="/auth/login" text small color="#827C85"
            >Login instead?
          </v-btn>
        </div>
      </div>
    </default-dialog>
  </validation-observer>
</template>

<script>
import { ValidationObserver } from 'vee-validate'
import registerPageMixin from '@/plugins/registerPageMixin'
import DefaultDialog from '@/components/dialogs/DefaultDialog'
import VTextFieldWithValidation from '@/components/validation/VTextFieldWithValidation'

export default {
  components: {
    ValidationObserver,
    VTextFieldWithValidation,
    DefaultDialog
  },

  mixins: [registerPageMixin],

  props: {
    value: Boolean
  }
}
</script>

<style scoped lang="scss">
.benefits {
  list-style-type: none;
  i.fa {
    color: #5b41bb;
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
