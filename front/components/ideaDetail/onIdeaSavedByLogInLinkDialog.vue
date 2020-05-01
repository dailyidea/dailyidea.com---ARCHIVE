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
      <v-card-title class="headline">Yay!</v-card-title>
      <v-card-text>
        Welcome back {{ name }}. We saved that idea for you! You can check all
        your saved ideas on your
        <router-link to="/ideas/liked">Saved Ideas page</router-link>.
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="ok">Nice!</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'OnFirstCommentInstantiatedDialog',
  data() {
    return {
      visible: false,
      name: ''
    }
  },
  methods: {
    close() {
      this.visible = false
    },
    ok() {
      this.visible = false
    },
    show(name) {
      this.name = name
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
