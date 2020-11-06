<template>
  <div ref="card" class="elevation-2 card">
    <slot></slot>
  </div>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>
.card {
  padding: 1rem;
  background-color: white;
  border-radius: 8px;
  border: 1px solid $light-grey !important;
  box-shadow: $card-shadow !important;
}
</style>
