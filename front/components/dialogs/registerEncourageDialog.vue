<template>
  <v-dialog
    v-model="visible"
    content-class="dialog-popup-content"
    persistent
    max-width="550"
  >
    <v-card>
      <v-icon
        text
        class="dialog-popup-content__cancel-icon"
        size="20"
        @click="close"
        >fas fa-times
      </v-icon>

      <v-card-text
        style="padding-top: 30px; padding-bottom: 20px; text-align: center"
      >
        <div class="head-text">
          Sign Up?
        </div>
        <v-card-text class="explanation-text">
          Found of browsing ideas? Enjoy even more with advantages of registered
          account. You will be able to: <br /><br />
          <span class="explanation-text__advantage"
            ><i class="fa fa-check"></i> Save the current post and return to it
            later</span
          >
          <span class="explanation-text__advantage"
            ><i class="fa fa-check"></i> Follow certain users</span
          >
          <span class="explanation-text__advantage"
            ><i class="fa fa-check"></i> Post your own ideas</span
          >
        </v-card-text>
        <v-card-text class="explanation-text">
          It's very easy! We only need your name and email
        </v-card-text>
        <v-card-text>
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
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="close">Cancel</v-btn>
          <v-btn :loading="registerInProgress" @click="signup"
            >Create Account</v-btn
          >
        </v-card-actions>
      </v-card-text>
    </v-card>
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
::v-deep .dialog-popup-content {
  position: relative;

  &__cancel-icon {
    position: absolute;
    right: 10px;
    top: 10px;
  }
}

.head-text {
  padding: 0 20px;
  font-size: 28px;
  text-align: center;
  color: $primary-color;
}

.explanation-text {
  font-size: 18px;
  line-height: 1.5;
  text-align: left;

  &__advantage {
    display: block;
    text-align: left;
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
