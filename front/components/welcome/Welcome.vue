<template>
  <span class="welcome-container">
    <welcome-first v-if="pageOn === 0"></welcome-first>
  </span>
</template>
<script>
import WelcomeFirst from '@/components/welcome/WelcomeFirst.vue'
export default {
  name: 'welcome',
  components: {
    WelcomeFirst
  },
  data() {
    return {
      pageOn: 0
    } 
  },
}
</script>
<style lang="scss" scoped>
.welcome-container {
  display: flex;
  align-items: center;
  position: fixed;
  top:0;
  left:0;
  width: 100vw;
  height: 100vh;
  z-index: 200;
  background-color: $welcome-background-color;
}
</style>
