<template>
  <auth-page lamp-on>
    <div v-if="data.unsubscribe.ok">
      <h1 class="pt-10 pb-6">Unsubscribed</h1>
      <p>
        {{ data.unsubscribe.userName }}, you've been unsubscribed from all
        emails.
      </p>
      <p>
        This has removed these emails:
      </p>
      <ul class="mb-4">
        <li>daily idea reminder</li>
        <li>weekly digest of ideas from other people</li>
        <li>
          your weekly stats (people who have liked or commented on your ideas)
        </li>
      </ul>
      <p>
        If you'd like to reinclude any of these or update your
        <router-link
          :to="userSlug ? `/profile/${userSlug}/settings` : '/auth/login'"
          >email preferences</router-link
        >.
      </p>
    </div>
    <div v-else class="text-center">
      <h1 class="pt-10 pb-6">Unsubscribed Failed</h1>
      <p>
        {{ data.unsubscribe.error }}
      </p>
    </div>
  </auth-page>
</template>

<script>
import { mapGetters } from 'vuex'
import AuthPage from '@/components/authPage/AuthPage'
import unsubscribe from '@/graphql/mutations/unsubscribe'

export default {
  name: 'Unsubscribe',

  components: { AuthPage },

  asyncData({ app, route }) {
    return app.$amplifyApi.graphql({
      query: unsubscribe,
      variables: {
        token: route.params.token,
        userId: route.params.userId
      },
      authMode: 'API_KEY'
    })
  },

  computed: {
    ...mapGetters({
      userSlug: 'userData/slug'
    })
  }
}
</script>

<style scoped lang="scss">
@import '~assets/style/common.scss';
</style>
