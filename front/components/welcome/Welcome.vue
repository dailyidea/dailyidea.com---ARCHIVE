<template>
  <span class="welcome-container">
    <welcome-first 
      @right-clicked="handleRightClicked" 
      @next="handleNext" 
      @mark-as-welcomed="handleMarkAsWelcomed"
      v-if="pageOn === 0"
    ></welcome-first>
    <welcome-second 
      @right-clicked="handleRightClicked" 
      @left-clicked="handleLeftClicked"
      @next="handleNext" 
      @mark-as-welcomed="handleMarkAsWelcomed"
      v-else-if="pageOn === 1"
    ></welcome-second>
    <welcome-third 
      @left-clicked="handleLeftClicked"
      @mark-as-welcomed="handleMarkAsWelcomed"
      v-else-if="pageOn === 2"
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
  name: 'welcome',
  components: {
    WelcomeFirst,
    WelcomeSecond,
    WelcomeThird
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
