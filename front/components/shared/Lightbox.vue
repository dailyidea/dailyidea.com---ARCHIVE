<template>
  <div v-if="value" class="lightbox-wrapper">
    <div class="lightbox-bg" @click="$emit('input', false)"></div>
    <card class="lightbox-card">
      <v-icon role="button" class="close-btn" @click="$emit('input', false)"
        >mdi mdi-close</v-icon
      >
      <slot />
    </card>
  </div>
</template>

<script>
import Card from '@/components/shared/Card'

export default {
  components: {
    Card
  },

  props: {
    value: { type: Boolean, required: true }
  }
}
</script>

<style lang="scss" scoped>
.lightbox-wrapper {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 500;
  overflow-y: auto;
}

.lightbox-card {
  position: relative;
  z-index: 502;
  margin-bottom: 2rem;
}

.lightbox-bg {
  position: fixed;
  z-index: 501;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
}

.close-btn {
  position: absolute;
  z-index: 503;
  top: -40px;
  right: 0;
  padding: 5px 4px 4px 5px;
  color: $primary-color;
  font-size: 20px;
  background-color: white;
  border-radius: 100%;
}
</style>
