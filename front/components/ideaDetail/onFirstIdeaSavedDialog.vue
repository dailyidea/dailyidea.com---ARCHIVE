<template>
  <v-dialog
    v-model="visible"
    content-class="dialog-popup-content"
    persistent
    max-width="600"
  >
    <v-card>
      <v-icon
        text
        class="dialog-popup-content__cancel-icon"
        size="20"
        @click="close"
        >fas fa-times
      </v-icon>
      <v-card-title class="headline">Hooray!</v-card-title>
      <v-card-text>
        You saved your first idea! Welcome to Daily idea. You can
        <router-link to="/ideas/all">browse more ideas</router-link> or
        <router-link to="/ideas/create"
          >start saving your own ideas</router-link
        >
        whenever you're ready.
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="ok">I'm in!</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'OnFirstCommentInstantiatedDialog',
  data() {
    return {
      visible: false
    }
  },
  methods: {
    close() {
      this.visible = false
    },
    ok() {
      this.visible = false
    },
    show() {
      this.visible = true
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
</style>
