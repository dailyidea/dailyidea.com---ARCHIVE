<template>
  <layout>
    <div class="settings-page">
      <h1 class="page-title">
        Settings
      </h1>

      <section class="page-section">
        <h2 class="section-heading">
          Your Info
        </h2>
        <v-row>
          <v-col cols="auto">
            <v-simple-table id="userInfo">
              <tbody>
                <tr>
                  <td class="muted">Your Name</td>
                  <td class="font-weight-black">{{ userName }}</td>
                </tr>
                <tr>
                  <td class="muted">Your Email Address</td>
                  <td class="font-weight-black">{{ email }}</td>
                </tr>
              </tbody>
            </v-simple-table>
          </v-col>
        </v-row>
      </section>

      <section class="page-section">
        <h2 class="section-heading">
          What Can We Email You About?
        </h2>
        <v-row>
          <v-col>
            <label>Idea Reminders</label>
            <p class="smaller muted">
              Daily email reminder to respond with a new idea
            </p>
          </v-col>
          <v-col>
            <v-switch
              v-model="emailNotificationsState.ideaReminders"
              dense
              flat
              inset
              hide-details
              color="secondary"
              @change="changeNotificationsState"
            ></v-switch>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <label>Hot Streaks</label>
            <p class="smaller muted">
              Weekly scorecard of your activity and reminder of when you go on a
              streak
            </p>
          </v-col>
          <v-col>
            <v-switch
              v-model="emailNotificationsState.hotStreaks"
              dense
              flat
              inset
              hide-details
              color="secondary"
              @change="changeNotificationsState"
            ></v-switch>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <label>Weekly Digests</label>
            <p class="smaller muted">
              Weekly digest of the best ideas from all users
            </p>
          </v-col>
          <v-col>
            <v-switch
              v-model="emailNotificationsState.weeklyDigests"
              dense
              flat
              inset
              hide-details
              color="secondary"
              @change="changeNotificationsState"
            ></v-switch>
          </v-col>
        </v-row>
      </section>
    </div>
    <visual-notifier ref="notifier"></visual-notifier>
  </layout>
</template>

<script>
import { graphqlOperation } from '@aws-amplify/api'
import getEmailNotificationsSettings from '@/graphql/query/getEmailNotificationsSettings'
import updateEmailNotificationsSettings from '@/graphql/mutations/updateEmailNotificationsSettings'
import Layout from '@/components/layout/Layout'
import VisualNotifier from '~/components/VisualNotifier'

export default {
  name: 'Index',
  middleware: 'authenticated',
  components: { Layout, VisualNotifier },
  async asyncData({ app }) {
    try {
      const { data } = await app.$amplifyApi.graphql(
        graphqlOperation(getEmailNotificationsSettings, {})
      )
      return {
        emailNotificationsState: data.getEmailNotificationsSettings
      }
    } catch (e) {
      this.$refs.notifier.error("Can't load Email Settings")
    }
  },
  data() {
    return {
      name: '',
      email: ''
    }
  },
  created() {
    this.userName = this.$store.getters['userData/userName']
    this.email = this.$store.getters['userData/email']
  },
  methods: {
    async changeNotificationsState() {
      try {
        await this.$amplifyApi.graphql(
          graphqlOperation(updateEmailNotificationsSettings, {
            state: this.emailNotificationsState
          })
        )
        this.$refs.notifier.success('Email Settings Updated')
      } catch (e) {
        this.$refs.notifier.error("Can't update Email Settings")
      }
    }
  }
}
</script>

<style scoped lang="scss">
@import '~assets/style/common';

#userInfo {
  border: 1px solid $color-muted-grey;
  -webkit-border-radius: 5px;
  -moz-border-radius: 5px;
  border-radius: 5px;

  td {
    border-bottom: 0;
    font-size: 16px;
  }
}
</style>
