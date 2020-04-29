<template>
  <layout>
    <v-simple-table>
      <thead>
        <tr>
          <th>#</th>
          <th>Today</th>
          <th>Last 7 days</th>
          <th>Last 30 days</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Users</strong></td>
          <td>{{ data.getStats.users.today }}</td>
          <td>{{ data.getStats.users.week }}</td>
          <td>{{ data.getStats.users.month }}</td>
          <td>{{ data.getStats.users.total }}</td>
        </tr>
        <tr>
          <td><strong>Ideas</strong></td>
          <td>{{ data.getStats.ideas.today }}</td>
          <td>{{ data.getStats.ideas.week }}</td>
          <td>{{ data.getStats.ideas.month }}</td>
          <td>{{ data.getStats.ideas.total }}</td>
        </tr>
        <tr>
          <td><strong>Shares</strong></td>
          <td>{{ data.getStats.shares.today }}</td>
          <td>{{ data.getStats.shares.week }}</td>
          <td>{{ data.getStats.shares.month }}</td>
          <td>{{ data.getStats.shares.total }}</td>
        </tr>
      </tbody>
    </v-simple-table>
  </layout>
</template>

<script>
import Layout from '@/components/layout/Layout'
import getStats from '@/graphql/query/getStats'

export default {
  name: 'Stats',
  components: { Layout },
  asyncData({ app }) {
    return app.$amplifyApi.graphql({ query: getStats, authMode: 'API_KEY' })
  }
}
</script>

<style scoped></style>
