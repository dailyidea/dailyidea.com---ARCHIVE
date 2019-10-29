<template>
  <v-dialog
    v-model="visible"
    content-class="subscribeForPrivateIdea"
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
        <img class="privateIdeaImg" src="~/assets/images/privateIdea.png" />
        <div class="boldBlackText">
          So you want to keep your ideas to yourself?
        </div>
        <div class="headlineText2">
          That's ok. Some things do need to stay private. Turn your idea private
          with just a click for only.
        </div>

        <div class="boldBlackText">
          $2.99/month
        </div>

        <!-- Submit Buttons -->
        <div class="subscribeBtn">
          <v-btn>SUBSCRIBE</v-btn>
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
.subscribeForPrivateIdea {
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

    .privateIdeaImg {
      height: 80px;
    }

    .boldBlackText {
      padding-top: 20px;
      font-size: 24px;
      width: 80%;
      margin: auto;
    }
    .headlineText2 {
      padding: 20px 0px 5px 0px;
      font-size: 16px;
      color: $accent-color;
    }

    .subscribeBtn {
      padding-top: 30px;
      button {
        width: 100%;
        height: 50px;
      }
    }
  }
}
</style>
