<template>
  <v-col cols="12" md="12">
    <welcome-first v-if="pageOn === 0"></welcome-first>
    <welcome-second v-else-if="pageOn === 1"></welcome-second>
    <welcome-third v-else-if="pageOn === 2"></welcome-third>
  </v-col>
</template>
<script>
import WelcomeFirst from '@/components/welcome/WelcomeFirst.vue'
import WelcomeSecond from '@/components/welcome/WelcomeSecond.vue'
import WelcomeThird from '@/components/welcome/WelcomeThird.vue'

export default {
  name: 'Welcome',
  components: {
    WelcomeFirst,
    WelcomeSecond,
    WelcomeThird
  },
  props: {
    pageOn: { type: Number, default: 0 }
  }
}
</script>
<style lang="scss" scoped></style>
