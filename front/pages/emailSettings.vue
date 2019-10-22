<template>
  <Layout
    v-bind="{
      backButton: true,
      loggedInHeader: true,
      mobileTitle: 'EMAIL SETTINGS'
    }"
  >
    <v-layout id="settingsPage">
      <v-container class="settingsList">
        <div class="emailSettingHeader">
          EMAIL SETTINGS
        </div>
        <div class="emailSubHeader">
          What can we email you about?
        </div>
        <div class="settingsItem">
          <div class="settingsInfo">
            <v-icon>fas fa-pen</v-icon>
            Idea Reminders
          </div>
          <div class="metadata">
            <v-switch
              v-model="switch1"
              class="swithBtn"
              inset
              :label="`On `"
            ></v-switch>
          </div>
        </div>
        <div class="settingsItem">
          <div class="settingsInfo"><v-icon>fas fa-bell</v-icon>Hot Steaks</div>
          <div class="metadata">
            <v-switch
              v-model="switch2"
              class="swithBtn"
              inset
              :label="`Off `"
            ></v-switch>
          </div>
        </div>
        <div class="settingsItem">
          <div class="settingsInfo">
            <v-icon>fas fa-cog</v-icon>
            Daily Digest
          </div>
          <div class="metadata">
            <v-switch
              v-model="switch2"
              class="swithBtn"
              inset
              :label="`Off `"
            ></v-switch>
          </div>
        </div>
        <div class="settingsItem">
          <div class="settingsInfo">
            <v-icon>fas fa-user</v-icon>
            Weekly Digest
          </div>
          <div class="metadata">
            <v-switch
              v-model="switch2"
              class="swithBtn"
              inset
              :label="`Off `"
            ></v-switch>
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
      switch1: true,
      switch2: true
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
#settingsPage {
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
      // margin-top: 2vh;
    }

    .emailSettingHeader {
      font-size: 25px;
      text-align: center;
      margin-bottom: 40px;
      @media #{$mobile} {
        display: none;
      }
    }

    .emailSubHeader {
      text-align: center;
      font-size: 18px;
      margin-bottom: 35px;
      color: #7777;

      @media #{$mobile} {
        text-align: left;
        font-size: 15px;
        margin-left: 17px;
        margin-top: 20px;
        margin-bottom: 20px;
      }
    }

    .settingsItem {
      border: 1px solid #e4e4e4;
      margin: 17px 15px 5px 15px;
      padding: 0px;
      display: flex;
      // height: 20px;
      font-size: 13px !important;

      .settingsInfo {
        flex: 1;
        margin-top: 25px;
        margin-left: 20px;
        font-size: 13px !important;
        color: $primary-color;
        i {
          color: $primary-color;
          font-size: 13px !important;
          margin-right: 15px;
        }
      }

      .metadata {
        text-align: right;
        font-size: 12px;
        margin-right: 20px;

        .swithBtn {
          .v-input--switch__track.theme--light.accent--text {
            color: #febe3d !important;
            caret-color: #febe3d !important;
          }
          flex: 1;
          float: right;
        }
      }
    }
  }
}
</style>
