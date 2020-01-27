<template>
  <v-dialog
    v-model="visible"
    content-class="dialog-popup-content"
    persistent
    max-width="400"
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
        <v-img
          class="private-icon"
          src="~/assets/images/privateIdea.png"
          contain
          :width="74"
          :height="60"
        ></v-img>
      </v-card-text>
      <div class="head-text">
        Want to make your Idea private?
      </div>
      <v-card-text class="explanation-text">
        That's ok. Some things aren't ready to be shared. Make this Idea private
        with just one click.
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn text @click="close">Cancel</v-btn>
        <v-btn @click="makePrivate">Make Private</v-btn>
      </v-card-actions>
    </v-card>
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

.private-icon {
  display: inline-block;
}
</style>
