<template>
  <v-layout id="settingsPage">
    <!-- Headers -->
    <div class="pageHeader">
      <v-layout hidden-sm-and-down>
        <desktopHeader></desktopHeader>
      </v-layout>
      <v-layout class="mobileHeader" row hidden-md-and-up>
        <v-flex xs2 sm2>
          <v-icon class="icons">fas fa-arrow-left</v-icon>
        </v-flex>
        <v-flex xs8 sm8 class="text">SETTINGS</v-flex>
      </v-layout>
    </div>

    <v-container class="settingsList">
      <div class="settingsItem">
        <div class="settingsInfo">
          <v-icon>fas fa-pen</v-icon>
          Me
        </div>
        <div class="metadata">John Doe</div>
      </div>
      <div class="settingsItem">
        <div class="settingsInfo">
          <v-icon>fas fa-bell</v-icon>Notifications
        </div>
        <div class="metadata">All</div>
      </div>
      <div class="settingsItem">
        <div class="settingsInfo">
          <v-icon>fas fa-cog</v-icon>
          General
        </div>
        <div class="metadata">Lorem Ipsum</div>
      </div>
      <div class="settingsItem">
        <div class="settingsInfo">
          <v-icon>fas fa-user</v-icon>
          Account
        </div>
        <div class="metadata">john.doe@mail.com</div>
      </div>
      <div class="settingsItem">
        <div class="settingsInfo">
          <v-icon>fas fa-lock</v-icon>
          Privacy
        </div>
        <div class="metadata">Only me</div>
      </div>
      <div class="settingsItem">
        <div class="settingsInfo">
          <v-icon>fas fa-question-circle</v-icon>Help
        </div>
        <div class="metadata">Questions?</div>
      </div>
      <div class="settingsItem">
        <div class="settingsInfo">
          <v-icon>fas fa-sign-out-alt</v-icon>Sign Out
        </div>
        <div class="metadata">Sign Out Now</div>
      </div>
    </v-container>
  </v-layout>
</template>
<script>
import { graphqlOperation } from '@aws-amplify/api'
import getIdeas from '~/graphql/mutations/getIdeas'
import desktopHeader from './../components/loggedInDesktopHeader'
export default {
  components: { desktopHeader },
  async asyncData({ app }) {
    const {
      data: { ideas }
    } = await app.$amplifyApi.graphql(graphqlOperation(getIdeas))
    debugger
    return {
      ideas: ideas.items
    }
  }
}
</script>

<style lang="scss">
// Remove top header manually
#app {
  .toolBar {
    display: none;
  }
  .nuxtContainer {
    padding-top: 0px !important;
  }
}
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
      margin-top: 2vh;
    }

    .settingsItem {
      border: 1px solid #e4e4e4;
      margin: 17px 15px 17px 15px;
      padding: 15px;
      display: flex;
      font-size: 13px !important;

      .settingsInfo {
        flex: 1;
        font-size: 13px !important;
        color: $primary-color;
        i {
          color: $primary-color;
          font-size: 13px !important;
          margin-right: 15px;
        }
      }

      .metadata {
        flex: 1;
        text-align: right;
        color: #c0b7c5;
        font-size: 12px;
      }
    }
  }
}
</style>
