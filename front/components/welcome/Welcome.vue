<template>
  <span class="welcome-container">
    <welcome-first
      v-if="pageOn === 0"
      @right-clicked="handleRightClicked"
      @next="handleNext"
      @mark-as-welcomed="handleMarkAsWelcomed"
    ></welcome-first>

    <welcome-second
      v-else-if="pageOn === 1"
      @right-clicked="handleRightClicked"
      @left-clicked="handleLeftClicked"
      @next="handleNext"
      @mark-as-welcomed="handleMarkAsWelcomed"
    ></welcome-second>

    <welcome-third
      v-else-if="pageOn === 2"
      @left-clicked="handleLeftClicked"
      @mark-as-welcomed="handleMarkAsWelcomed"
    ></welcome-third>
  </span>
</template>
<script>
import { graphqlOperation } from '@aws-amplify/api'
import WelcomeFirst from '@/components/welcome/WelcomeFirst.vue'
import WelcomeSecond from '@/components/welcome/WelcomeSecond.vue'
import WelcomeThird from '@/components/welcome/WelcomeThird.vue'
import setWasWelcomed from '~/graphql/mutations/setWasWelcomed'
export default {
  name: 'Welcome',
  components: {
    WelcomeFirst,
    WelcomeSecond,
    WelcomeThird
  },
  data() {
    return {
      pageOn: 0
    }
  },
  computed: {
    userId() {
      return this.$store.getters['userData/userId']
    }
  },
  methods: {
    handleMarkAsWelcomed() {
      this.$amplifyApi.graphql(
        graphqlOperation(setWasWelcomed, {
          userId: this.userId
        })
      )

      this.$emit('hide-welcomed')
    },
    handleNext() {
      this.pageOn += 1
    },
    handleLeftClicked() {
      this.pageOn -= 1
    },
    handleRightClicked() {
      this.pageOn += 1
    }
  }
}
</script>
<style lang="scss" scoped>
.welcome-container {
  display: flex;
  position: fixed;
  align-items: center;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 200;
  background-color: $welcome-background-color;
}
</style>
