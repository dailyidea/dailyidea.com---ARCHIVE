<template>
  <div id="commonHeader">
    <!-- Non login page header -->
    <v-toolbar
      v-if="!$store.getters['cognito/isLoggedIn'] || currentPage == 'Home'"
      class="toolBar"
      flat
      absolute
    >
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
    </v-toolbar>

    <!-- Loggedin page header -->
    <template v-else>
      <!-- Sidebar menu -->
      <v-navigation-drawer
        v-model="showSideMenu"
        class="sidebarMenu"
        absolute
        temporary
      >
        <v-list dense dark>
          <!-- Back button -->
          <div class="backBtn" @click="showSideMenu = false">
            <i
              class="fas fa-arrow-left hidden-sm-and-down"
              hidden-sm-and-small
            ></i>
            <i class="fas fa-times  hidden-md-and-up" style="float: right;"></i>
          </div>

          <div class="logoContainer hidden-sm-and-down">
            <img src="~/assets/images/logo_with_text.png" />
          </div>

          <v-list-item>
            <v-list-item-content>
              <router-link to="/ideas/public">
                <v-list-item-title>Public Ideas</v-list-item-title>
              </router-link>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <router-link to="/ideas/me">
                <v-list-item-title>My Ideas</v-list-item-title>
              </router-link>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>Saved Ideas</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <router-link to="/profile">
                <v-list-item-title>My Profile</v-list-item-title>
              </router-link>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>Leaderboards</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title>Sign Out</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item class="mediaSection">
            <v-list-item-content>
              <v-list-item-title>
                <v-btn class="mediaBtn" outlined fab color="primary">
                  <v-icon>fab fa-facebook-f</v-icon>
                </v-btn>
                <v-btn class="mediaBtn" outlined fab color="primary">
                  <v-icon>fab fa-twitter</v-icon>
                </v-btn>
                <v-btn class="mediaBtn" outlined fab color="primary">
                  <v-icon>fab fa-google-plus-g</v-icon>
                </v-btn>
              </v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>

      <div class="loggedInHeader">
        <!-- Desktop Header -->
        <v-toolbar
          class="desktop hidden-sm-and-down"
          flat
          absolute
          color="white"
        >
          <!-- Left Title Side - Desktop -->
          <v-toolbar-title class="blue--text subheading">
            <!-- Idea detail page -left side - desktop -->
            <v-icon
              v-if="pageOptions.leftButtonType == 'hamburder'"
              class="desktopMenu"
              @click="showSideMenu = true"
              >fas fa-align-left</v-icon
            >
            <v-icon v-else class="icons backButon" @click="onBackClick()"
              >fas fa-arrow-left</v-icon
            >

            <!-- Logo on top left corner -->
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
            v-if="searchIdeaMode"
            class="searchInput"
            placeholder="What are you looking for?"
            flat
            solo
            label
            prepend-inner-icon="fas fa-search"
          ></v-text-field>
          <v-icon
            v-if="searchIdeaMode"
            class="closeIconForDesktopSearch "
            @click="searchIdeaMode = false"
            >fas fa-times</v-icon
          >

          <v-spacer></v-spacer>

          <!-- Right Side Desktop Options -->
          <template>
            <!-- Search Button -->
            <v-btn
              icon
              class="rightSideIconLight"
              @click="searchIdeaMode = true"
            >
              <v-icon v-if="!searchIdeaMode">fas fa-search</v-icon>
            </v-btn>

            <!-- Settings Button -->
            <v-btn class="rightSideIconLight" icon to="/settings">
              <v-icon>fas fa-cog</v-icon>
            </v-btn>

            <!-- Print Logged-in user's name -->
            <span class="userName">{{
              $store.getters['cognito/username']
            }}</span>

            <!-- Profile Icon -->
            <v-btn small to="/profile" class="profileBtn" fab>
              <v-icon>fas fa-user</v-icon>
            </v-btn>
          </template>
        </v-toolbar>

        <!-- Mobile Header -->
        <v-app-bar
          v-if="!searchIdeaMode"
          flat
          absolute
          color="white"
          class="mobileToolbar hidden-md-and-up"
        >
          <!-- Hamburber or back button -->
          <v-btn
            v-if="pageOptions.leftButtonType == 'hamburder'"
            class="lightPinkButton"
            icon
            @click="showSideMenu = true"
          >
            <v-icon>mdi-menu</v-icon>
          </v-btn>
          <v-btn v-else class="lightPinkButton" icon @click="onBackClick()">
            <v-icon>mdi-arrow-left</v-icon>
          </v-btn>

          <!-- Idea Detail Page UI -->
          <template v-if="currentPage == 'IdeaDetail'" class="ideaDetailHeader">
            <v-toolbar-title class="pageTitle">
              <template v-if="!pageOptions.isIdeaEditable">
                {{ pageOptions.pageTitle }}
              </template>
              <v-btn
                v-else
                :class="{ lightPinkButton: !pageOptions.ideaEditorVisible }"
                rounded
                outlined
                class="editIdeaButton"
                @click="$emit('toggleIdeaEditor')"
              >
                My Idea &nbsp; <v-icon left>mdi-pencil</v-icon>
              </v-btn>
            </v-toolbar-title>

            <v-spacer></v-spacer>

            <!-- Bookmark button -->
            <v-btn text icon color="gray" class="bookmarkIdeaButton">
              <img
                v-if="pageOptions.isIdeaBookmarked"
                class="saveIdea"
                src="~/assets/images/saveIdeaImage.png"
                @click="$emit('showSaveIdeaForMobileDailog')"
              />
              <img
                v-if="!pageOptions.isIdeaBookmarked"
                class="unsaveIdea"
                src="~/assets/images/unSaveIdeaImage.png"
                @click="$emit('showSaveIdeaForMobileDailog')"
              />
            </v-btn>

            <!-- Idea Detail Mobile Settings Menu -->
            <v-menu>
              <template v-slot:activator="{ on }">
                <v-btn icon v-on="on">
                  <v-icon>mdi-dots-vertical</v-icon>
                </v-btn>
              </template>
              <v-list>
                <v-list-item>
                  <v-list-item-title>Share</v-list-item-title>
                </v-list-item>
                <v-list-item @click="$emit('showShareIdeaDialog')">
                  <v-list-item-title>Share by Email</v-list-item-title>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title>Report Idea</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </template>

          <!-- Idea List Page UI -->
          <template v-if="currentPage == 'IdeaList'">
            <v-toolbar-title class=" pageTitle">
              {{ pageOptions.pageTitle }}
            </v-toolbar-title>

            <v-spacer></v-spacer>

            <!-- Search Button -->
            <v-btn class="lightPinkButton" icon @click="searchIdeaMode = true">
              <v-icon>mdi-magnify</v-icon>
            </v-btn>
          </template>
        </v-app-bar>

        <!-- Mobile search toolbar => Position fixed - will hide original mobile header -->
        <v-toolbar
          v-else
          flat
          absolute
          color="white"
          class="mobile searchIdeaContainer hidden-md-and-up"
        >
          <v-text-field
            ref="mobileMenuSearchIdeaBox"
            placeholder="What are you looking for?"
            hide-details
            prepend-inner-icon="search"
            outlined
          ></v-text-field>
          <v-icon class="closeIcon " @click="searchIdeaMode = false"
            >fas fa-times</v-icon
          >
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
  components: {},
  props: {
    // Show loggedin or loggedout header
    loggedInHeader: {
      type: Boolean,
      default: false
    },

    // Page specific ui variables
    currentPage: {
      type: String,
      default: ''
    },

    pageOptions: {
      type: Object,
      default: null
    }
  },

  data() {
    return {
      searchIdeaMode: false,
      showSideMenu: null
      // items: [
      //   { title: 'Home', icon: 'dashboard' },
      //   { title: 'About', icon: 'question_answer' }
      // ]
    }
  },
  watch: {
    pageOptions: {
      handler(n, o) {
        this.pageOptions = n
      },
      deep: true
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

    onShowDesktopSearchIdeaBox() {
      this.searchModeForDesktop = true
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

  .lightPinkButton {
    border-color: #c0b7c5 !important;
    color: #c0b7c5 !important;
    i,
    .v-btn__content {
      color: #c0b7c5 !important;
    }
  }

  .loggedInHeader {
    width: 100%;
    background: white !important;

    .desktop {
      z-index: 100;
      width: 100%;

      .backButon {
        margin-right: 20px;

        color: $primary-color;
        font-size: 15px;
        line-height: 20px;
        cursor: pointer;
      }

      .hamburder {
        margin-right: 20px;
        margin-top: -9px;
        font-size: 20px;
      }

      // For non loggedin user
      .helpLink {
        color: #c0b7c5 !important;
        font-style: none !important;
        text-decoration: none !important;
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
        margin-left: 15% !important;
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

      .closeIconForDesktopSearch {
        position: absolute;
        right: 456px;
        font-size: 13px;
      }

      .desktopSearchIconContainer {
        .desktopSeachIcon {
          color: #c0b7c5;
          margin-right: 20px;
        }
      }

      .rightSideIconLight {
        i {
          color: #c0b7c5;
        }
      }

      .userName {
        margin-left: 8px;

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

    .mobileToolbar {
      // Adjust mobile menubar padding
      .v-toolbar__content {
        padding: 0px 7px !important;
      }

      // Make page title aligned to center
      .pageTitle {
        width: 100%;
        text-align: center;
        padding-right: 0px !important;
        padding-left: 0px !important;
      }

      // For Idea Detail PAge
      .editIdeaButton {
        margin: 0px !important;
        i {
          margin: 0px !important;
        }
      }

      // For Idea Detail PAge
      .bookmarkIdeaButton {
        margin-top: -8px;
        margin-right: -10px;
      }
    }

    .mobile.searchIdeaContainer {
      width: 100%;

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

  .sidebarMenu {
    background: rgb(35, 16, 49) !important;
    z-index: 999;
    width: 320px !important;

    @media #{$small-screen} {
      width: 100% !important;
    }

    .backBtn {
      margin: 10px 15px;
      height: 10px;
      font-size: 18px;
      cursor: pointer;
      @media #{$small-screen} {
        margin-bottom: 10vh;
      }
    }

    .logoContainer {
      margin-top: 0vh;
      margin-bottom: 3vh;
      text-align: center;

      img {
        height: 20vh;
        margin-top: 3vh;
      }
    }

    // display: none;
    .v-list-item {
      margin-left: 30px;
      margin-right: 30px;

      @media #{$small-screen} {
        margin-left: 15%;
        margin-right: 15%;
      }
      border-bottom: 1px solid #827c852e !important;

      .v-list-item__content {
        // height: 7vh;
        cursor: pointer;

        margin-top: 2vh !important;
        margin-bottom: 1.8vh !important;

        @media #{$small-screen} {
          margin-top: 3vh !important;
          margin-bottom: 3vh !important;
        }

        .nuxt-link-exact-active.nuxt-link-active {
          text-decoration: none;
        }

        .v-list-item__title {
          font-size: 15px;
          text-align: center;
          color: white;

          @media #{$small-screen} {
            font-size: 16px;
          }

          .mediaBtn {
            margin-right: 12px;
            color: white !important;

            .v-icon {
              font-size: 13px;
            }
          }
        }

        &:hover {
          .v-list-item__title {
            color: #ffca19 !important;
          }
        }
      }
    }

    .mediaSection {
      margin-top: 4vh;
      border-bottom: none !important;
    }
  }

  .nuxtContainer {
    padding-top: 64px !important;
  }
}
</style>
