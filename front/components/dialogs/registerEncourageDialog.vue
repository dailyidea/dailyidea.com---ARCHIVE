<template>
  <v-dialog v-model="visible" content-class="modal" persistent max-width="600">
    <div class="closeBtn">
      <v-icon text class="cancelIcon" @click="close">mdi-close</v-icon>
    </div>

    <!-- Header -->
    <section class="modalHeader">
      <h3>Get The Best Ideas In Your Inbox</h3>
      <v-img
        max-height="180"
        max-width="180"
        class="mx-auto modalTopImage"
        contain
        src="~/assets/images/dialogs/undraw_real_time_collaboration_c62i.svg"
      ></v-img>
    </section>

    <!-- Body -->
    <section class="modalBody">
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
    </section>

    <!-- Footer -->
    <section class="modalFooter">
      <!-- Action Buttons -->
      <div class="text-right">
        <v-btn class="cancelBtn" rounded text @click="close">Cancel</v-btn>
        <v-btn :loading="registerInProgress" rounded @click="signup"
          >Sign Up</v-btn
        >
      </div>
    </section>
  </v-dialog>
</template>

<script>
import registerPageMixin from '@/plugins/registerPageMixin'

export default {
  name: 'RegisterEncourageDialog',
  mixins: [registerPageMixin],
  data() {
    return {
      visible: false
    }
  },
  methods: {
    show() {
      this.visible = true
      return new Promise((resolve, reject) => {
        this.resolve = resolve
        this.reject = reject
      })
    },
    close() {
      this.visible = false
      this.resolve(false)
    }
  }
}
</script>

<style scoped lang="scss">
@import '~assets/style/common';
@import '~assets/style/modals';

::v-deep .dialog-popup-content {
  position: relative;

  &__cancel-icon {
    position: absolute;
    right: 10px;
    top: 10px;
  }
}

ul.benefits {
  li {
    list-style: none;

    i {
      margin-right: 6px;
      color: #2db754;
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
