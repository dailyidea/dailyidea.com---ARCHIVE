<template>
  <Layout
    v-bind="{
      currentPage: 'Settings',
      pageOptions: mobileHeaderUiOptions
    }"
  >
    <v-layout id="settingsPage">
      <div class="headerOfSetting">
        Settings
      </div>
      <v-container class="settingsList">
        <div class="settingEmail">
          <p>My email:</p>
          <div class="email-section">
            <div>{{ userEmail }}</div>
            <v-icon>fas fa-pen</v-icon>
          </div>
        </div>
        <div class="subheader">
          What can we email you about?
        </div>
      </v-container>

      <v-container class="emailSettingsList">
        <!-- Idea Reminders -->
        <div class="settingsItem">
          <div class="settingsTitle">
            Idea Reminders
          </div>
          <div class="settingsInput">
            <v-switch
              v-model="emailNotificationsState.ideaReminders"
              small
              hide-message
              class="swithBtn"
              inset
              :label="``"
              @change="changeNotificationsState"
            ></v-switch>
          </div>
        </div>

        <!-- Hot Streaks -->
        <div class="settingsItem">
          <div class="settingsTitle">
            Hot Streaks
          </div>
          <div class="settingsInput">
            <v-switch
              v-model="emailNotificationsState.hotStreaks"
              small
              hide-message
              class="swithBtn"
              inset
              :label="``"
              @change="changeNotificationsState"
            ></v-switch>
          </div>
        </div>

        <!-- Daily Digests -->
        <div class="settingsItem">
          <div class="settingsTitle">
            Daily Digests
          </div>
          <div class="settingsInput">
            <v-switch
              v-model="emailNotificationsState.dailyDigests"
              small
              hide-message
              class="swithBtn"
              inset
              :label="``"
              @change="changeNotificationsState"
            ></v-switch>
          </div>
        </div>

        <!-- Weekly Digests -->
        <div class="settingsItem">
          <div class="settingsTitle">
            Weekly Digests
          </div>
          <div class="settingsInput">
            <v-switch
              v-model="emailNotificationsState.weeklyDigests"
              small
              hide-message
              class="swithBtn"
              inset
              :label="``"
              @change="changeNotificationsState"
            ></v-switch>
          </div>
        </div>
        <visual-notifier ref="notifier"></visual-notifier>
      </v-container>
    </v-layout>
  </Layout>
</template>
<script>
import { graphqlOperation } from '@aws-amplify/api'
import userInfo from '~/graphql/query/userInfo'
import VisualNotifier from '~/components/VisualNotifier'
import Layout from '@/components/layout/Layout'
import updateEmailNotificationsSettings from '@/graphql/mutations/updateEmailNotificationsSettings'
import getEmailNotificationsSettings from '@/graphql/query/getEmailNotificationsSettings'
export default {
  components: { Layout, VisualNotifier },
  async asyncData({ app, route, store }) {
    const profileUserId = store.getters['cognito/userSub']
    const { data } = await app.$amplifyApi.graphql(
      graphqlOperation(userInfo, { userId: profileUserId })
    )
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
    return {
      profileInfo: data.userInfo.userInfo
    }
  },
  data() {
    return {
      profileInfo: null,
      mobileHeaderUiOptions: {
        pageTitle: 'Settings',
        leftButtonType: 'back'
      }
    }
  },
  computed: {
    userEmail() {
      return this.$store.state.cognito.user.username
    }
  },
  methods: {
    async loadSettings() {
      try {
        const res = await this.$amplifyApi.graphql(
          graphqlOperation(getEmailNotificationsSettings, {})
        )
        this.emailNotificationsState = res.data.getEmailNotificationsSettings
      } catch (e) {
        this.$refs.notifier.error("Can't update Email Settings")
      }
    },
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
<style lang="scss">
#settingsPage {
  padding-top: 100px;
  background: white;
  min-height: 100vh;
  padding-bottom: 2vh;
  display: block;
  width: 100%;
  overflow-x: hidden;
  padding-right: 3%;
  padding-left: 2%;
  .headerOfSetting {
    text-align: center;
    font-size: 25px;
    font-weight: bold;
    @media #{$small-screen} {
      margin-top: 3vh;
      font-size: 20px;
    }
  }
  @media #{$small-screen} {
    padding-top: 0vh;
  }
  .pageHeader {
    // border: 1px solid red;
    padding: 25px 15px;
    width: 100%;
    .mobileHeader {
      .text {
        text-align: center;
        margin-top: 2px;
        font-size: 14px;
        font-weight: 600;
        font-style: normal;
        font-stretch: normal;
        line-height: 1.57;
        letter-spacing: 0.42px;
        text-align: center;
        color: #18141c;
      }
      i {
        color: #c0b7c5 !important;
        font-size: 15px;
      }
    }
  }
  .settingsList {
    max-width: 700px;
    // border: 1px solid red;
    margin-top: 5vh;
    padding: 0px !important;
    @media #{$mobile} {
      margin-top: 2vh;
    }
    .settingEmail {
      margin-top: 5vh;
      p {
        color: #c0b7c5;
      }
      .email-section {
        padding-bottom: 15px;
        border-bottom: solid 2px #c0b7c5;
        div {
          display: inline-block;
        }
        i {
          float: right;
          font-size: 16px;
          margin-right: 10px;
          color: black;
          cursor: pointer;
        }
      }
    }
    .subheader {
      margin-top: 40px;
      font-size: 22px;
      font-weight: bold;
      @media #{$mobile} {
        font-size: 18px;
      }
    }
  }
  .emailSettingsList {
    max-width: 700px;
    // border: 1px solid red;
    margin-top: 5vh;
    padding: 0px !important;
    @media #{$mobile} {
      margin-top: 2vh;
    }
    .settingsItem {
      margin-top: 10px;
      margin-bottom: 10px;
      width: 100%;
      display: inline-flex;
      font-size: 13px !important;
      .settingsTitle {
        flex: 1;
        font-size: 16px !important;
        vertical-align: bottom;
        line-height: 28px;
        color: $primary-color;

        @media #{$small-screen} {
          font-size: 14px !important;
        }
        i {
          color: $primary-color;
          font-size: 13px !important;
          margin-right: 15px;
        }
      }
      .settingsInput {
        // border: 1px solid red;
        text-align: right;
        float: right;
        .swithBtn {
          margin-top: 0px;
          padding-top: 4px;
          // width: 47px;
          // border: 1px solid red;
          display: inline-block;
          text-align: right;
          .v-input__slot {
            margin: 0px;
          }
          .v-input--switch__track.theme--light.accent--text {
            color: #ffbe3d !important;
            opacity: 1;
            caret-color: #ffbe3d !important;
          }
          .v-messages {
            display: none;
          }
        }
      }
    }
  }
}
</style>
