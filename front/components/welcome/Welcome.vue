<template>
  <span class="welcome-container">
    <welcome-first @next="handleNext" v-if="pageOn === 0"></welcome-first>
    <welcome-second @next="handleNext" v-else-if="pageOn === 1"></welcome-second>
    <welcome-third v-else-if="pageOn === 2"></welcome-third>
  </span>
</template>
<script>
import WelcomeFirst from '@/components/welcome/WelcomeFirst.vue'
import WelcomeSecond from '@/components/welcome/WelcomeSecond.vue'
import WelcomeThird from '@/components/welcome/WelcomeThird.vue'
export default {
  name: 'welcome',
  components: {
    WelcomeFirst,
    WelcomeSecond,
    WelcomeThird
  },
  methods: {
    handleNext() {
      this.pageOn += 1
    }
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
