<template>
  <Layout
    v-bind="{
      currentPage: 'EmailSettings',
      pageOptions: mobileHeaderUiOptions
    }"
  >
    <v-layout id="emailSettingsPage">
      <div class="headerOfSetting">
        EMAIL SETTINGS
      </div>

      <div class="subheader">
        What can we email you about?
      </div>

      <v-container class="settingsList">
        <!-- Idea Reminders -->
        <div class="settingsItem">
          <div class="settingsTitle">
            Idea Reminders
          </div>
          <div class="settingsInput">
            <v-switch
              v-model="ideaReminders"
              small
              hide-message
              class="swithBtn"
              inset
              :label="``"
            ></v-switch>
            <div v-if="ideaReminders" class="statusLabel active">ON</div>
            <div v-if="!ideaReminders" class="statusLabel">OFF</div>
          </div>
        </div>

        <!-- Hot Streaks -->
        <div class="settingsItem">
          <div class="settingsTitle">
            Hot Streaks
          </div>
          <div class="settingsInput">
            <v-switch
              v-model="hotStreaks"
              small
              hide-message
              class="swithBtn"
              inset
              :label="``"
            ></v-switch>
            <div v-if="hotStreaks" class="statusLabel active">ON</div>
            <div v-if="!hotStreaks" class="statusLabel">OFF</div>
          </div>
        </div>

        <!-- Daily Digests -->
        <div class="settingsItem">
          <div class="settingsTitle">
            Daily Digests
          </div>
          <div class="settingsInput">
            <v-switch
              v-model="dailyDigests"
              small
              hide-message
              class="swithBtn"
              inset
              :label="``"
            ></v-switch>
            <div v-if="dailyDigests" class="statusLabel active">ON</div>
            <div v-if="!dailyDigests" class="statusLabel">OFF</div>
          </div>
        </div>

        <!-- Weekly Digests -->
        <div class="settingsItem">
          <div class="settingsTitle">
            Weekly Digests
          </div>
          <div class="settingsInput">
            <v-switch
              v-model="weeklyDigests"
              small
              hide-message
              class="swithBtn"
              inset
              :label="``"
            ></v-switch>
            <div v-if="weeklyDigests" class="statusLabel active">ON</div>
            <div v-if="!weeklyDigests" class="statusLabel">OFF</div>
          </div>
        </div>
      </v-container>
    </v-layout>
  </Layout>
</template>
<script>
import Layout from '@/components/layout/Layout'
export default {
  components: { Layout },
  data() {
    return {
      mobileHeaderUiOptions: {
        pageTitle: 'EMAIL SETTINGS',
        leftButtonType: 'back'
      },
      ideaReminders: false,
      hotStreaks: false,
      dailyDigests: false,
      weeklyDigests: false
    }
  },
  methods: {
    signout() {
      this.$store.dispatch('cognito/signOut')
    }
  }
}
</script>

<style lang="scss">
#emailSettingsPage {
  padding-top: 50px;
  background: white;
  min-height: 100vh;
  padding-bottom: 2vh;
  display: block;
  width: 100%;
  overflow-x: hidden;

  padding-right: 3%;
  padding-left: 2%;

  @media #{$small-screen} {
    padding-top: 0vh;
    padding-left: 5%;
    padding-right: 5%;
  }

  .headerOfSetting {
    text-align: center;
    font-size: 25px;

    @media #{$small-screen} {
      display: none;
    }
  }

  .subheader {
    color: #c0b7c5;
    text-align: center;
    margin-top: 20px;
  }

  .settingsList {
    max-width: 700px;
    width: 100%;
    margin-top: 3vh;
    padding: 0px !important;
    @media #{$mobile} {
      margin-top: 2vh;
    }

    .settingsItem {
      border: 1px solid #e4e4e4;
      margin: 10px 0px 17px 0px;
      padding: 15px;
      width: 100%;
      display: inline-flex;
      font-size: 13px !important;

      .settingsTitle {
        flex: 1;
        font-size: 13px !important;
        vertical-align: bottom;
        line-height: 28px;
        color: $primary-color;
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

          .v-input--switch__track.theme--light.accent--text {
            color: #ffbe3d !important;
            opacity: 1;
            caret-color: #ffbe3d !important;
          }

          .v-input__slot {
            margin: 0px;
          }

          .v-messages {
            display: none;
          }
        }

        .statusLabel {
          display: inline-block;
          color: #e0e0e0;
          font-size: 16px;
          margin-right: 0px;
          margin-left: 0px;
          margin-top: 0px;
          vertical-align: top;
          padding-top: 4px;
        }

        .active {
          color: #ffbe3d;
        }
      }
    }
  }
}
</style>
