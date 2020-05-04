<template>
  <div class="noIdeaFoundDiv">

    <!-- eslint-disable-next-line -->
    <div class="text-center" v-html="noIdeaMessage">
    </div>

  </div>
</template>

<script>
export default {
  name: 'IdeasListEmptyMessage',
  props: {
    noIdeaMessage: {
      type: String,
      default: `You don't have any ideas right now. <br /> Or do you?`
    }
  }
}
</script>

<style scoped lang="scss">
</style>
