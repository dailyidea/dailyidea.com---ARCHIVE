<template>
  <auth-page lamp-on>
    <div v-if="data.snoozeEmails.ok" class="text-center">
      <h1 class="pt-10 pb-6">Settings Updated</h1>
      <p>
        Sometimes life gets busy and you don't have time to post new ideas..
      </p>
      <p>
        We've paused sending you email update reminders for {{ weeks }} weeks.
      </p>
      <p>
        If you want to edit any of your other email settings, you can do so in
        your a
        <router-link to="/settings">email settings</router-link>
        .
      </p>
    </div>
    <div v-else class="text-center">
      <h1 class="pt-10 pb-6">Settings Update Failed</h1>
      <p>
        {{ data.snoozeEmails.error }}
      </p>
    </div>
  </auth-page>
</template>

<script>
import AuthPage from '@/components/authPage/AuthPage'
import snoozeEmails from '@/graphql/mutations/snoozeEmails'

export default {
  name: 'SnoozeEmails',
  components: { AuthPage },
  asyncData({ app, route }) {
    return app.$amplifyApi.graphql({
      query: snoozeEmails,
      variables: {
        token: route.query.token,
        userId: route.query.userId,
        days: route.query.days
      },
      authMode: 'API_KEY'
    })
  },
  data: () => ({}),
  computed: {
    weeks() {
      return this.$route.query.days / 7
    }
  },
  mounted() {}
}
</script>

<style scoped lang="scss">
@import '~assets/style/common';
</style>
