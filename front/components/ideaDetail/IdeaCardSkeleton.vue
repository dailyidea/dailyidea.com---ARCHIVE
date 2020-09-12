<template>
  <div class="idea-card-skeleton">
    <div ref="page" align="stretch" class="elevation-2 ma-1 card">
      <v-skeleton-loader
        ref="skeleton"
        :boilerplate="true"
        type="card-heading, list-item-avatar, divider, list-item-three-line, image, actions"
        :tile="false"
        class="mx-auto"
      ></v-skeleton-loader>
    </div>
  </div>
</template>

<script>
export default {
  //
}
</script>

<style lang="scss" scoped>
.idea-card-skeleton {
  display: flex;
  justify-content: center;
  position: relative;
  width: 100%;
}

.card {
  position: absolute;
  height: 70vh;
  width: calc(100% - 8px);
  padding: 1rem;
  background-color: white;
  border-radius: 8px;
  overflow: hidden;

  @media only screen and (min-width: $screen-md-min) {
    margin: 0 auto !important;
    margin-top: 2vh !important;
    width: 70vw;
    height: 71vh;
  }
}
</style>
