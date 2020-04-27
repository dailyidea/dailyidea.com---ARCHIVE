<template>
  <v-dialog
    v-model="visible"
    content-class="modal"
    persistent
    max-width="600"
  >
    <div class="closeBtn">
      <v-icon text class="cancelIcon" @click="close">mdi-close</v-icon>
    </div>

    <!-- Header -->
    <section class="modalHeader">
      <h3>Want To Make Your Idea Private?</h3>
      <v-img
        max-width="180"
        max-height="180"
        class="mx-auto modalTopImage"
        contain
        src="~/assets/images/dialogs/undraw_security_o890.svg"
      ></v-img>
    </section>

    <!-- Body -->
    <section class="modalBody">
      <p>
        That's ok!
      </p>
      <p>
        Some things aren't ready to be shared. Make this idea private
        with just one click.
      </p>
    </section>

    <!-- Footer -->
    <section class="modalFooter">
      <!-- Action Buttons -->
      <div class="text-right">
        <v-btn class="cancelBtn"
          rounded
          text
          @click="close"
          >Cancel</v-btn>
        <v-btn
          rounded
          @click="makePrivate"
          >Make Private</v-btn
        >
      </div>
    </section>

  </v-dialog>
</template>

<script>
export default {
  name: 'MakeIdeaPrivateDialog',
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
    makePrivate() {
      this.visible = false
      this.resolve(true)
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
  margin-top: 30px;
  margin-bottom: 20px;
  font-size: 18px;
  line-height: 1.5;
  text-align: center;
}

</style>
