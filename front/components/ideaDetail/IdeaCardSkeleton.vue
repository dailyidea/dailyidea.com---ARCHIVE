<template>
  <div class="skeleton-card">
    <card :additional-styling="additionalStyling">
      <v-skeleton-loader
        ref="skeleton"
        :boilerplate="true"
        type="card-heading, list-item-avatar, divider, list-item-three-line, image, actions"
        :tile="false"
        class="skeleton"
      ></v-skeleton-loader>
    </card>
  </div>
</template>

<script>
import Card from '@/components/shared/Card'

export default {
  components: { Card },

  props: {
    additionalStyling: { type: Object, default: Object }
  }
}
</script>

<style lang="scss" scoped>
.skeleton-card {
  position: absolute;
  width: 100%;
  padding: 4px;

  height: 60vh;

  @media only screen and (min-width: $screen-md-min) {
    width: 70vw;
    left: calc(50% - 35vw);
  }

  .skeleton {
    height: 100%;
  }
}
</style>
