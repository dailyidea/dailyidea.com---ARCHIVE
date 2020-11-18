<template>
  <layout>
    <card class="layout-card">
      <slot />
    </card>
  </layout>
</template>

<script>
import Layout from '@/components/layout/Layout'
import Card from '@/components/shared/Card'

export default {
  components: { Layout, Card }
}
</script>

<style lang="scss" scoped>
.layout-card {
  margin: 0 auto;

  @media (min-width: $screen-md-min) {
    min-width: 70vw;
    max-width: 70vw;
    left: calc(50% - 35vw);
  }
}
</style>
