<template>
  <auth-page lamp-on>
    <div clss="text-center">
      <h1 class="pt-10 pb-6 text-center">Congrats and Welcome!</h1>
      <p>
        <span class="dailyText">Daily</span
        ><span class="ideaText">Idea</span> is a site where you can:
      </p>
      <ul>
        <li>
          Store your ideas so you can remember them and improve them over time
        </li>
        <li>Browse other folks's ideas to inspire yourself further</li>
      </ul>
      <p class="mt-5"></p>
      <p>
        We'll send you a daily email reminder to come up with a new idea. Just
        respond in your email and we'll automatically store it for you.
      </p>
      <p>
        Over time, you'll become an idea machine!
      </p>
      <p>
        In the meantime, you can create an idea from your dashboard or just
        browse other ideas.
      </p>

      <v-form class="mainForm mt-10" @submit.prevent="goToIdeasPage">
        <v-btn block rounded type="submit" class="">Get Started! </v-btn>
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
      this.$router.replace('/ideas-cards')
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

.dailyText,
.ideaText {
  text-transform: uppercase;
  font-weight: 900;
  letter-spacing: 2px;
}

.dailyText {
  color: $primary-color;
}

.ideaText {
  color: $secondary-color;
}
</style>
