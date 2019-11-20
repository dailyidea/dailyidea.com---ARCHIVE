<template>
  <v-dialog
    v-model="visible"
    content-class="saveIdeaWithoutLoginDialog"
    persistent
    max-width="450px"
  >
    <!-- Close Button -->
    <div class="closeBtn">
      <v-icon text class="cancelIcon" size="20" @click="closeDialog()"
        >fas fa-times</v-icon
      >
    </div>

    <div class="inputMode">
      <!-- Popup Header -->
      <v-row>
        <v-col cols="12" sm="4">
          <img
            alt="image"
            class="girlImage"
            src="~/assets/images/saveDailogMobile.png"
          />
        </v-col>
        <v-col cols="12" sm="8">
          <div class="title">Save Idea</div>
          <div class="description">
            To save this idea and get back to it at any time, you need to create
            an account. Don't worry, all we need is your email.
          </div>
        </v-col>
      </v-row>

      <form id="save-idea-without-login-form">
        <!-- Text Fields -->

        <!-- Submit Button -->
        <div class="btnContainer">
          <router-link
            to="/auth/login"
            style="text-decoration: none; margin-top: 5px; display: inline-block;"
          >
            <v-btn
              type="submit"
              class="specialButton shareBtn"
              form="save-idea-without-login-form"
              >Log in</v-btn
            >
          </router-link>
          <router-link
            to="/auth/signup"
            style="text-decoration: none; margin-top: 5px; display: inline-block;"
          >
            <v-btn
              type="submit"
              class="specialButton shareBtn"
              form="save-idea-without-login-form"
              >CREATE ACCOUNT</v-btn
            >
          </router-link>
        </div>
      </form>
    </div>
  </v-dialog>
</template>

<script>
export default {
  $_veeValidate: {
    validator: 'new'
  },
  props: {
    visible: {
      type: Boolean,
      default: true
    }
  },
  data: () => ({
    successMode: false,
    form: {
      name: '',
      email: ''
    }
  }),
  methods: {
    closeDialog() {
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss">
.saveIdeaWithoutLoginDialog {
  overflow: visible;
  padding: 20px 20px;
  background: white;
  width: 100%;
  max-width: 450px !important;
  position: relative;

  .cancelIcon {
    position: absolute;
    right: 10px;
    top: 10px;
  }

  .inputMode {
    .girlImage {
      @media (min-width: $screen-sm-min) {
        height: 250px;
        position: relative;
        left: -50px;
      }
      @media (max-width: $screen-xs-max) {
        margin: auto;
        display: block;
        height: 150px;
        /*width: auto;*/
      }
    }
    .description {
      font-size: 16px;
      line-height: 24px;
      letter-spacing: 1px;
      color: #707070;
    }
    .title {
      margin: 3vh 0vh;
      color: black;
      font-size: 20px;
      @media #{$small-screen} {
        margin: 1vh 0vh;
      }
    }

    .inputDetails {
      margin-top: 3vh;
      padding-left: 12px;
      padding-right: 12px;
    }

    .btnContainer {
      margin-top: 15px;
      margin-bottom: 20px;
      text-align: right;
    }
  }
}
</style>
