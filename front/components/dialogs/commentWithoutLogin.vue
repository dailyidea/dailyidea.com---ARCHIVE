<template>
  <v-dialog
    v-model="visible"
    content-class="commentWithoutLoginDialog"
    persistent
    max-width="500px"
  >
    <!-- Popup Header -->
    <div class="header">
      <v-icon text class="cancelIcon" size="20" @click="$emit('close')"
        >fas fa-times</v-icon
      >
    </div>

    <!-- Popup body -->
    <form>
      <div class="body">
        <div class="headlineText1">
          Oops,
        </div>
        <div class="headlineText2">
          Verify your email or signin to post your comment.
        </div>

        <!-- Text Fields -->
        <div>
          <v-text-field
            v-model="commentForm.Email"
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
          <v-btn>SEND</v-btn>
        </div>
      </div>
    </form>
  </v-dialog>
</template>

<script>
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
    commentForm: {
      Email: ''
    }
  })
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
    .headlineText1 {
      padding-top: 20px;
      font-size: 28px;
    }
    .headlineText2 {
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
