<template>
  <div id="commonHeader">
    <!-- Non login page header -->
    <v-toolbar v-if="!loggedInHeader" class="toolBar" flat absolute>
      <v-toolbar-title class="blue--text subheading">
        <nuxt-link class="logoLink" :to="{ name: 'index' }">
          <img class="logoIcon" src="~/assets/images/logo_icon.png" />
          <img class="logoIcon logoText" src="~/assets/images/logo_text.png" />
        </nuxt-link>
      </v-toolbar-title>
      <v-spacer />
      <template>
        <nuxt-link class="helpLink" :to="{ name: 'auth-login' }">Login</nuxt-link>
        <nuxt-link class="userLink" :to="{ name: 'auth-signup' }">
          <v-icon>fa-user</v-icon>
        </nuxt-link>
      </template>
    </v-toolbar>

    <!-- Loggedin page header -->
    <template v-else-if="$store.getters['cognito/isLoggedIn']">
      <div class="loggedInHeader">
        <!-- Desktop Header -->
        <v-layout hidden-sm-and-down>
          <v-toolbar class="desktop" flat absolute color="white">
            <v-toolbar-title class="blue--text subheading">
              <!-- Show Back button if enabled -->
              <v-icon v-if="backButton" class="icons backButon" @click="onBackClick()">fas fa-arrow-left</v-icon>

              <nuxt-link class="logoLink" :to="{ name: 'index' }">
                <img class="logoIcon" src="~/assets/images/logo_icon.png" />
                <img class="logoIcon logoText" src="~/assets/images/logo_text.png" />
              </nuxt-link>
            </v-toolbar-title>

            <!-- Search Box -->
            <v-text-field class="searchInput" flat solo label prepend-inner-icon="fas fa-search"></v-text-field>

            <v-spacer />
            <template>
              <v-icon style="color: #c0b7c5;">fas fa-cog</v-icon>
              <span class="userName">{{
                $store.getters['cognito/username']
              }}</span>
              <v-btn small to="/profile" class="profileBtn" fab>
                <v-icon>fas fa-user</v-icon>
              </v-btn>
            </template>
          </v-toolbar>
        </v-layout>

        <!-- Mobile HEader -->
        <v-toolbar v-if="!searchIdeaMode" flat absolute color="white" class="mobile" hidden-md-and-up>
          <v-layout class="nonSearchSection" row>
            <!-- Left Side Icon -->
            <v-layout>
              <v-flex v-if="mobileHamburger" xs1 sm1>
                <v-icon class="icons" @click="$refs.mobileMenu.visible = true">fas fa-bars</v-icon>
                <MobileMenu ref="mobileMenu"></MobileMenu>
              </v-flex>
              <v-flex v-else-if="backButton" xs1 sm1>
                <v-icon class="icons" @click="onBackClick()">fas fa-arrow-left</v-icon>
              </v-flex>

              <!-- Center Title -->
              <v-flex xs8 sm8 class="text">{{ mobileTitle }}</v-flex>
            </v-layout>

            <!-- Rightside Icons -->
            <v-flex xs3 sm3 class="rightSide">
              <!-- Edit Idea Icon -->
              <v-icon v-if="editIdeaVisible" class="icons menu" @click="$emit('onEditIdea')">fas fa-pen</v-icon>

              <!-- Search Idea Button -->
              <v-icon v-if="mobileSearchIcon" class="icons menu" @click="onShowSearchIdeaBox()">fas fa-search</v-icon>

              <!-- Share idea button and menu-->
              <v-icon v-if="shareIdeaVisible" class="icons menu" @click="$emit('showShareIdeaDialog')" v-on="on">fas fa-envelope</v-icon>
              <v-menu v-if="shareIdeaVisible" class="shareIdea">
                <template v-slot:activator="{ on }">
                  <v-icon class="icons menu" v-on="on">fas fa-ellipsis-v</v-icon>
                </template>
                <v-list>
                  <v-list-item>
                    <v-list-item-title>Share</v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="onCopyShareIdeaLink">
                    <v-list-item-title>Copy Direct Link</v-list-item-title>
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-title>Report Idea</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-flex>
          </v-layout>
        </v-toolbar>
        <v-toolbar v-else flat absolute color="white" class="mobile searchIdeaContainer" hidden-md-and-up>
          <v-text-field ref="mobileMenuSearchIdeaBox" placeholder="What are you looking for?" hide-details prepend-inner-icon="search" outlined></v-text-field>
          <v-icon class="closeIcon " @click="searchIdeaMode = false">fas fa-times</v-icon>
        </v-toolbar>
      </div>
    </template>

    <!-- Router contents -->
    <v-content class="nuxtContainer">
      <v-layout>
        <v-flex>
          <slot />
        </v-flex>
      </v-layout>
      <vue-snotify />
    </v-content>

    <!-- Footer -->
    <!-- <v-footer app>
      <span>Dailyidea &copy; 2018</span>
    </v-footer>-->
  </div>
</template>
<script>
import MobileMenu from '@/components/menuComponent'
export default {
  components: { MobileMenu },
  props: {
    backButton: {
      type: Boolean,
      default: false
    },
    loggedInHeader: {
      type: Boolean,
      default: false
    },
    mobileTitle: {
      type: String,
      default: ''
    },
    mobileHamburger: {
      type: Boolean,
      default: false
    },
    mobileSearchIcon: {
      type: Boolean,
      default: false
    },
    shareIdeaVisible: {
      type: Boolean,
      default: false
    },
    onCopyShareIdeaLink: {
      default: null,
      type: Function
    },
    editIdeaVisible: {
      type: Boolean,
      default: false
    },
    settingsIconVisible: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      mobileMenuVisible: false,
      searchIdeaMode: false
    }
  },
  created() {},
  methods: {
    onBackClick() {
      this.$router.back()
    },
    onShareIdea() {
      this.$root.$emit('share')
    },
    onShowSearchIdeaBox() {
      this.searchIdeaMode = true
    },
    logout() {
      this.$store.dispatch('cognito/signOut')
    }
  }
}
</script>
<style lang="scss">
#commonHeader {
  .toolBar {
    background: white !important;
    color: #c0b7c5 !important;
    font-style: none !important;
    text-decoration: none !important;
    width: 100% !important;

    .helpLink {
      color: #c0b7c5 !important;
      font-style: none !important;
      text-decoration: none !important;
    }

    i {
      color: #c0b7c5 !important;
      font-style: none !important;
      text-decoration: none !important;
      font-size: 15px !important;
      margin-left: 17px;
    }

    .logoLink {
      text-decoration: none;

      .logoIcon {
        height: 24px !important;
      }

      .logoText {
        margin-top: 9px;
        height: 19px;
      }
    }
  }

  .loggedInHeader {
    width: 100%;
    background: white !important;

    .desktop {
      z-index: 100;
      width: 100%;

      .helpLink {
        color: #c0b7c5 !important;
        font-style: none !important;
        text-decoration: none !important;
      }

      .backButon {
        margin-right: 20px;

        color: $primary-color;
        font-size: 15px;
        line-height: 20px;
        cursor: pointer;
      }

      .logoLink {
        text-decoration: none;

        .logoIcon {
          height: 24px;
        }

        .logoText {
          margin-top: 4px;
          height: 19px;
        }
      }

      .searchInput {
        border: solid 1px rgba(228, 228, 228, 0.38);

        padding: 0px;
        margin-left: 12% !important;
        width: 40%;

        .v-input__control {
          max-height: 35px !important;
          min-height: 35px !important;
          //   padding: 5px;

          .v-input__slot {
            border: none;
            padding-left: 5px;

            .v-icon {
              font-size: 20px !important;
              color: #ebe7ed;
            }

            .v-text-field__slot {
              margin-left: 10px !important;
            }

            &::before {
              border: none;
            }
          }

          .v-text-field__details {
            display: none;
          }
        }
      }

      .userName {
        margin-left: 20px;

        font-size: 20px;
        font-weight: normal;
        font-style: normal;
        font-stretch: normal;
        line-height: 1.5;
        letter-spacing: normal;
        text-align: left;
        color: #18141c;
      }

      .profileBtn {
        background: #ebe7ed !important;
        padding: 10px 15px;
        margin-left: 20px;
        border-radius: 50%;

        i {
          font-size: 14px !important;
          line-height: 16px !important;
          color: #35124e !important;
        }
      }
    }

    .mobile {
      padding: 0px 10px;
      margin-left: 0px;
      margin-right: 0px;
      width: 100%;

      .nonSearchSection {
        padding: 0px 0px;

        .text {
          text-align: left !important;
          padding-left: 5px;
          margin-top: 2px;
          font-size: 14px;
          font-weight: 600;
          line-height: 1.57;
          color: #18141c;
        }

        .icons {
          color: #c0b7c5 !important;
          font-size: 16px;
        }

        .rightSide {
          text-align: right;

          .shareIdea {
            display: inline-block;
            margin-right: 6px;
          }

          i {
            color: #35124e !important;
            padding-bottom: 0px;
            text-align: right;
            margin-right: 6px;
          }
        }
      }
    }

    .mobile.searchIdeaContainer {
      .v-input__slot {
        max-height: 40px;
        min-height: 40px;
        // border: 2px solid green;
        padding: 0px 5px;

        .v-input__prepend-inner {
          margin-top: 8px;

          .v-icon {
            font-size: 17px;
          }
        }

        .v-text-field__slot {
          max-height: 43px;
          overflow: hidden;

          fieldset {
            max-height: 43px;
          }

          input {
            // border: 1px solid blue;
            font-size: 15px;
          }
        }
      }

      .closeIcon {
        position: absolute;
        right: 25px;
        font-size: 12px;
      }
    }
  }

  .nuxtContainer {
    padding-top: 56px !important;
  }
}
</style>
