<template>
  <v-dialog
    v-model="visible"
    content-class="saveIdeaWithoutLoginDialog"
    persistent
    max-width="450px"
  >
    <!-- Close Button -->
    <div class="closeBtn">
      <v-icon text class="cancelIcon" size="20" @click="$emit('close')"
        >fas fa-times</v-icon
      >
    </div>

    <!-- Popup Header -->
    <v-layout class="dialogHeader">
      <v-flex md6 xs5>
        <img
          alt="image"
          class="girlImage"
          src="~/assets/images/saveDailogMobile.png"
        />
      </v-flex>
      <v-flex md6 xs7 class="rightSide">
        <div class="title">Save Idea</div>
        <div class="description">
          To save this idea and get back to it at any time, you need to create
          an account. Don't worry, all we need is your email.
        </div>
      </v-flex>
    </v-layout>

    <form>
      <!-- Text Fields -->
      <div class="inputDetails">
        <v-text-field
          v-model="form.name"
          v-validate="'required|max:100'"
          prepend-inner-icon="fas fa-user"
          single-line
          flat
          :error-messages="errors.collect('name')"
          data-vv-name="name"
          label="Enter your name"
        >
        </v-text-field>
        <v-text-field
          v-model="form.email"
          v-validate="'required|email|max:100'"
          prepend-inner-icon="email"
          single-line
          flat
          :error-messages="errors.collect('email')"
          data-vv-name="email"
          label="Enter your email address"
        ></v-text-field>
      </div>

      <!-- Submit Button -->
      <div class="btnContainer">
        <v-btn class="specialButton shareBtn" @click="onSubmit">SUBMIT</v-btn>
      </div>
    </form>
  </v-dialog>
</template>

<script>
export default {
  $_veeValidate: {
    validator: 'new'
  },
  // computed: {
  // 	dialogVisible: function() {
  // 		return visible
  // 	}
  // },
  props: {
    // Show loggedin or loggedout header
    visible: {
      type: Boolean,
      default: true
    }
  },
  data: () => ({
    form: {
      name: '',
      email: ''
    }
  }),
  methods: {
    async onSubmit() {
      let result = await this.$validator.validateAll()
      this.errorMsg = ''
      if (!result) {
        return
      }

      // Logic goes here
    }
  }
}
</script>

<style lang="scss">
.saveIdeaWithoutLoginDialog {
  padding: 40px 40px;
  background: white;
  width: 100%;
  max-width: 450px !important;
  position: relative;

  .cancelIcon {
    position: absolute;
    right: 10px;
    top: 10px;
  }

  .dialogHeader {
    .girlImage {
      width: 110%;
      margin-left: -15%;
      height: auto;

      @media #{$small-screen} {
        width: 150%;
        margin-left: -55%;
      }
    }

    .rightSide {
      .title {
        margin: 3vh 0vh;
        color: black;
        font-size: 20px;
        @media #{$small-screen} {
          margin: 1vh 0vh;
        }
      }
      .description {
        font-size: 16px;
        line-height: 24px;
        letter-spacing: 1px;
        color: #707070;
        @media #{$small-screen} {
          font-size: 13px;
        }
      }
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

    .shareBtn {
      width: 100%;
      height: 50px;
    }
  }
}
</style>
