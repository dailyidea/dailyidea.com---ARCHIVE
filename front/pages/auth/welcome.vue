<template>
  <auth-page lamp-on>
    <div class="successMessage">
      <div class="heroMsg">Congrats and welcome!</div>
      <div class="heroDescription">
        these are the things you can do. this is what you should expect. in the
        meantime, feel free to create your first idea or browse other people's
        ideas.
      </div>
      <div class="heroDescription">
        also we sent you an email so you can try out the email responses. you'll
        get one every day from now on.
      </div>
      <v-form class="mainForm" @submit.prevent="goToIdeasPage">
        <v-btn type="submit" large class="startJourneyBtn"
          >Start a journey
        </v-btn>
      </v-form>
    </div>
  </auth-page>
</template>

<script>
import { graphqlOperation } from '@aws-amplify/api'
import AuthPage from '@/components/authPage/AuthPage'
import setWasWelcomed from '~/graphql/mutations/setWasWelcomed'


export default {
  name: 'Success',
  components: { AuthPage },
  data: () => ({
    email: null
  }),
  mounted() {
    this.setWasWelcomed()
  },
  methods: {
    goToIdeasPage() {
      this.$router.replace('/ideas/all')
    },
    setWasWelcomed() {
      this.$amplifyApi.graphql(
        graphqlOperation(setWasWelcomed, {
          userId: this.$store.getters['userData/userId']
        })
      )
    }
  }
}
</script>

<style scoped lang="scss">
@import '~assets/style/common';

@include authLoginSuccessStyle;
.startJourneyBtn {
  margin-top: 15px;
  border-radius: 4px;
  width: 100%;
  letter-spacing: 1px;
}
</style>
