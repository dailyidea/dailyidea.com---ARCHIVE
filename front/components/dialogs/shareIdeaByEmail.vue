<template>
  <!-- Popup - Share Via Email -->
  <v-dialog
    v-model="visible"
    content-class="emailShareDialog"
    persistent
    max-width="400px"
  >
    <div class="closeBtn">
      <v-icon text class="cancelIcon" size="18" @click="$emit('close')"
        >fas fa-times</v-icon
      >
    </div>

    <!-- Popup Header -->
    <div class="header">
      <v-icon text class="shareIcon" size="60">fas fa-envelope</v-icon>
      <div class="headlineText">
        Share Idea by Email
      </div>
    </div>

    <form>
      <v-text-field
        v-model="form.name"
        v-validate="'required|max:100'"
        :error-messages="errors.collect('name')"
        data-vv-name="name"
        label=" Your name"
        outlined
      >
      </v-text-field>
      <v-text-field
        v-model="form.friendName"
        v-validate="'required|max:100'"
        :error-messages="errors.collect('friend name')"
        data-vv-name="friend name"
        label=" Your Friend's name"
        outlined
      ></v-text-field>
      <v-text-field
        v-model="form.friendEmail"
        v-validate="'required|email|max:100'"
        append-icon="email"
        :error-messages="errors.collect('email')"
        data-vv-name="email"
        label="Your Friend's email "
        outlined
      ></v-text-field>

      <!-- Submit Buttons -->
      <div class="btnContainer">
        <v-btn class="cancleBtn" text @click="$emit('close')">Cancel</v-btn>
        <v-btn class="specialButton shareBtn" @click="sendShareEmail()"
          >Share</v-btn
        >
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
    form: {
      name: '',
      friendName: '',
      friendEmail: ''
    }
  })
}
</script>

<style lang="scss">
.emailShareDialog {
  padding: 15px 20px 20px 20px;
  background: white;

  .closeBtn {
    .cancelIcon {
      float: right;
    }
  }

  .header {
    text-align: center;
    margin-bottom: 20px;
    margin-top: 30px;

    .headlineText {
      margin: 20px 0px 20px 0px;
      font-size: 23px;
    }

    .cancelIcon {
      border: 1px solid red;
      float: right;
      padding-bottom: 10px;
    }
  }

  .shareIcon {
    color: rgba(255, 185, 45);
  }

  .btnContainer {
    margin-top: 20px;
    margin-bottom: 20px;
    text-align: right;
    .shareBtn {
      width: 170px;
    }
  }
}
</style>
