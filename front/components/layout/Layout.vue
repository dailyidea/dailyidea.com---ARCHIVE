<template>
  <div id="commonHeader">
    <!-- Non login page header -->
    <v-app-bar v-if="!loggedInHeader" app class="toolBar" flat absolute>
      <v-toolbar-title class="blue--text subheading">
        <nuxt-link class="logoLink" :to="{ name: 'index' }">
          <img class="logoIcon" src="~/assets/images/logo_icon.png" />
          <img class="logoIcon logoText" src="~/assets/images/logo_text.png" />
        </nuxt-link>
      </v-toolbar-title>
      <v-spacer />
      <template>
        <nuxt-link class="helpLink" :to="{ name: 'auth-login' }"
          >Login</nuxt-link
        >
        <nuxt-link class="userLink" :to="{ name: 'auth-signup' }">
          <v-icon>fa-user</v-icon>
        </nuxt-link>
      </template>
    </v-app-bar>

    <!-- Loggedin page header -->
    <template v-else-if="$store.getters['cognito/isLoggedIn']">
      <div class="loggedInHeader">
        <!-- Desktop Header -->
        <v-layout hidden-sm-and-down>
          <v-toolbar class="desktop" app flat absolute color="white">
            <v-toolbar-title class="blue--text subheading">
              <!-- Show Back button if enabled -->
              <v-icon
                v-if="backButton"
                class="icons backButon"
                @click="onBackClick()"
                >fas fa-arrow-left</v-icon
              >

              <nuxt-link class="logoLink" :to="{ name: 'index' }">
                <img class="logoIcon" src="~/assets/images/logo_icon.png" />
                <img
                  class="logoIcon logoText"
                  src="~/assets/images/logo_text.png"
                />
              </nuxt-link>
            </v-toolbar-title>

            <!-- Search Box -->
            <v-text-field
              class="searchInput"
              flat
              solo
              label
              prepend-inner-icon="fas fa-search"
            ></v-text-field>

            <v-spacer />
            <template>
              <v-icon style="color: #c0b7c5;">fas fa-cog</v-icon>
              <span class="userName">{{
                $store.getters['cognito/username']
              }}</span>
              <span class="userIcon">
                <v-icon>fas fa-user</v-icon>
              </span>
            </template>
          </v-toolbar>
        </v-layout>

        <!-- Mobile HEader -->
        <v-toolbar app flat absolute color="white" hidden-md-and-up>
          <v-layout class="mobile" row hidden-md-and-up>
            <!-- Left Side Icon -->
            <v-flex v-if="mobileHamburger" xs2 sm2>
              <v-icon class="icons" @click="$refs.mobileMenu.visible = true"
                >fas fa-bars</v-icon
              >
              <MobileMenu ref="mobileMenu"></MobileMenu>
            </v-flex>
            <v-flex v-else-if="backButton" xs2 sm2>
              <v-icon class="icons" @click="onBackClick()"
                >fas fa-arrow-left</v-icon
              >
            </v-flex>

            <!-- Center Title -->
            <v-flex xs7 sm7 class="text">{{ mobileTitle }}</v-flex>

            <!-- Rightside Icons -->
            <v-flex xs3 sm3 class="rightSide">
              <!-- Share Idea Button -->
              <v-menu v-show="shareIdeaVisible" class="shareIdea">
                <template v-if="shareIdeaVisible" v-slot:activator="{ on }">
                  <v-icon class="icons menu" v-on="on">fas fa-share-alt</v-icon>
                </template>
                <v-list>
                  <v-list-tile @click="onCopyShareIdeaLink">
                    <v-list-tile-title>Copy Link</v-list-tile-title>
                  </v-list-tile>
                  <v-list-tile @click="$emit('showShareIdeaDialog')">
                    <v-list-tile-title>Shaer Via Email</v-list-tile-title>
                  </v-list-tile>
                </v-list>
              </v-menu>

              <!-- Edit Idea Icon -->
              <v-icon
                v-if="editIdeaVisible"
                class="icons menu"
                @click="$emit('onEditIdea')"
                >fas fa-pen</v-icon
              >

              <!-- Search Idea Button -->
              <v-icon v-if="mobileSearchIcon" class="icons menu"
                >fas fa-search</v-icon
              >

              <!-- Settings Icon -->
              <v-icon v-else-if="settingsIconVisible" class="icons menu"
                >fas fa-ellipsis-v</v-icon
              >
            </v-flex>
          </v-layout>
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
export default {
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
      default: null
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
  created() {
    console.log('at main params =>', this.backButton)
  },
  methods: {
    onBackClick() {
      this.$router.back()
    },
    onShareIdea() {
      this.$root.$emit('share')
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

      .userIcon {
        background: #ebe7ed;
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
      padding: 0px 0px;
      margin-left: 0px;
      margin-right: 0px;

      .text {
        text-align: center;
        margin-top: 2px;
        font-size: 14px;
        font-weight: 600;
        line-height: 1.57;
        text-align: center;
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
          margin-right: 7px;
        }

        i {
          color: #35124e !important;
          padding-bottom: 0px;
          text-align: right;
          margin-right: 7px;
        }
      }
    }
  }

  .nuxtContainer {
    padding-top: 56px !important;
  }
}

body {
  .specialButton {
    background-image: $secondary-gradient;
    color: white !important;
    -webkit-box-shadow: 10px 10px 52px -10px rgba(255, 247, 156, 1) !important;
    -moz-box-shadow: 10px 10px 52px -10px rgba(255, 247, 156, 1) !important;
    box-shadow: 10px 10px 52px -10px rgba(255, 247, 156, 1) !important;

    &:hover {
      background-image: none;
      background: #ffb92d !important;
    }
  }
}
</style>
