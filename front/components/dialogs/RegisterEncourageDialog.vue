<template>
  <default-dialog
    :value="value"
    :image-path="
      require('~/assets/images/dialogs/undraw_real_time_collaboration_c62i.svg')
    "
    header="Get The Best Ideas In Your Inbox"
    button-ok-text="Sign Up"
    :button-ok-loading="registerInProgress"
    @ok="signup"
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
        <i class="fa fa-check"></i> Save the current post and return to it later
      </li>
      <li><i class="fa fa-check"></i> Follow certain users</li>
      <li><i class="fa fa-check"></i> Post your own ideas</li>
    </ul>

    <!-- form -->
    <form @submit.stop.prevent="signup">
      <v-text-field
        v-model="name"
        v-validate="'required|max:100'"
        :error-messages="errors.collect('name')"
        data-vv-name="name"
        label="Your name"
        single-line
        flat
        placeholder="Your Name"
        prepend-inner-icon="mdi-account-circle-outline"
      ></v-text-field>
      <v-text-field
        v-model="email"
        v-validate="'required|email'"
        :error-messages="errors.collect('email')"
        data-vv-name="email"
        single-line
        flat
        label="Your Email"
        placeholder="Your Email"
        prepend-inner-icon="mdi-email-outline"
      ></v-text-field>
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
</template>

<script>
import registerPageMixin from '@/plugins/registerPageMixin'
import DefaultDialog from '@/components/dialogs/DefaultDialog'

export default {
  components: {
    DefaultDialog
  },

  mixins: [registerPageMixin],

  props: {
    value: Boolean
  }
}
</script>

<style scoped lang="scss">
.emailExistsMsg {
  text-align: center;
  width: 70%;
  margin: auto;
  max-width: 420px;
  color: #c8c7c7;
}
</style>
