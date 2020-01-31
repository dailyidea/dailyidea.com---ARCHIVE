<template>
  <layout>
    <div class="settings-page">
      <v-img
        src="~/assets/images/light_gray_lamp.png"
        height="100"
        contain
      ></v-img>
      <div class="settings-page__title">
        Settings
      </div>
      <div class="settings-page__email-field">
        <v-text-field
          v-model="email"
          readonly
          color="#232323"
          :height="55"
          label="My Email"
          placeholder="Placeholder"
        ></v-text-field>
      </div>
      <div class="settings-page__email-switches-title">
        What can we email you about?
      </div>
      <div class="settings-page__email-switches">
        <v-row class="settings-page__email-switches__row">
          <v-col class="settings-page__email-switches__label"
            >Idea Reminders</v-col
          >
          <v-col class="settings-page__email-switches__switch-container">
            <v-switch
              v-model="emailNotificationsState.ideaReminders"
              dense
              hide-details
              class="settings-page__email-switches__switch"
              inset
              flat
              color="warning"
              @change="changeNotificationsState"
            ></v-switch>
          </v-col>
        </v-row>
        <v-row class="settings-page__email-switches__row">
          <v-col class="settings-page__email-switches__label"
            >Hot Streaks</v-col
          >
          <v-col class="settings-page__email-switches__switch-container">
            <v-switch
              v-model="emailNotificationsState.hotStreaks"
              dense
              hide-details
              class="settings-page__email-switches__switch"
              inset
              flat
              color="warning"
              @change="changeNotificationsState"
            ></v-switch>
          </v-col>
        </v-row>
        <v-row class="settings-page__email-switches__row">
          <v-col class="settings-page__email-switches__label"
            >Daily Digests</v-col
          >
          <v-col class="settings-page__email-switches__switch-container">
            <v-switch
              v-model="emailNotificationsState.dailyDigests"
              dense
              hide-details
              class="settings-page__email-switches__switch"
              inset
              flat
              color="warning"
              @change="changeNotificationsState"
            ></v-switch>
          </v-col>
        </v-row>
        <v-row class="settings-page__email-switches__row">
          <v-col class="settings-page__email-switches__label"
            >Weekly Digests</v-col
          >
          <v-col class="settings-page__email-switches__switch-container">
            <v-switch
              v-model="emailNotificationsState.weeklyDigests"
              dense
              hide-details
              class="settings-page__email-switches__switch"
              inset
              flat
              color="warning"
              @change="changeNotificationsState"
            ></v-switch>
          </v-col>
        </v-row>
      </div>
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
      email: ''
    }
  },
  computed: {},
  created() {
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

$main-text-color: #232323;
.settings-page {
  @include pageMargin;

  &__title {
    text-align: center;
    padding: 15px 0;
    font-size: 21px;
    font-weight: 600;
    letter-spacing: 1px;
  }

  &__email-switches-title {
    font-size: 21px;
    font-weight: 600;
    padding: 15px 0;
  }

  &__email-switches {
    &__switch {
      margin-top: 0;
      float: right;
      margin-right: -15px;
    }
  }
}
</style>
