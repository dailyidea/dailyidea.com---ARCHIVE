<template>
  <swipable-card class="skeleton-card absolute">
    <v-skeleton-loader
      ref="skeleton"
      :boilerplate="true"
      type="card-heading, list-item-avatar, divider, list-item-three-line, image, actions"
      :tile="false"
      class="skeleton"
    ></v-skeleton-loader>
  </swipable-card>
</template>

<script>
import SwipableCard from '@/components/shared/SwipableCard'

export default {
  components: { SwipableCard }
}
</script>
