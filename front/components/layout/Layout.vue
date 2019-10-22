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
        <nuxt-link class="helpLink" :to="{ name: 'auth-login' }"
          >Login</nuxt-link
        >
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
            <!-- Top Left Side -->
            <v-toolbar-title class="blue--text subheading">
              <!-- Desktop Menu Button -->
              <v-icon
                v-if="desktopMenuVisible"
                class="desktopMenu"
                @click="openDesktopMenu = true"
                >fas fa-align-left</v-icon
              >

              <!-- Show Back button if enabled -->
              <v-icon
                v-if="backButton"
                class="icons backButon"
                @click="onBackClick()"
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
              v-if="searchModeForDesktop"
              class="searchInput"
              placeholder="What are you looking for?"
              flat
              solo
              label
              prepend-inner-icon="fas fa-search"
            ></v-text-field>
            <v-icon
              v-if="searchModeForDesktop"
              class="closeIconForDesktopSearch "
              @click="searchModeForDesktop = false"
              >fas fa-times</v-icon
            >
            <v-spacer />
            <template>
              <div class="searchIcon">
                <v-icon
                  v-if="!searchModeForDesktop"
                  class="desktopSeachIcon"
                  @click="onShowDesktopSearchIdeaBox()"
                  >fas fa-search</v-icon
                >
              </div>
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

        <!-- Desktop sidebar menu -->
        <v-navigation-drawer
          v-model="openDesktopMenu"
          class="menuOfDesktop"
          absolute
          temporary
        >
          <v-list dense dark>
            <!-- Back button -->
            <div class="backBtn" @click="openDesktopMenu = false">
              <i class="fas fa-arrow-left"></i>
            </div>

            <div class="logoContainer">
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

        <!-- Mobile HEader -->
        <v-toolbar
          v-if="!searchIdeaMode"
          flat
          absolute
          color="white"
          class="mobile"
          hidden-md-and-up
        >
          <v-layout class="nonSearchSection" row>
            <!-- Left Side Icon -->
            <v-layout>
              <v-flex v-if="mobileHamburger" xs1 sm1>
                <v-icon class="icons" @click="$refs.mobileMenu.visible = true"
                  >fas fa-bars</v-icon
                >
                <MobileMenu ref="mobileMenu"></MobileMenu>
              </v-flex>
              <v-flex v-else-if="backButton" xs1 sm1>
                <v-icon class="icons" @click="onBackClick()"
                  >fas fa-arrow-left</v-icon
                >
              </v-flex>

              <!-- Center Title -->
              <v-flex xs8 sm8 class="text">{{ mobileTitle }}</v-flex>

              <v-btn
                v-if="showPrivateIdeaBtn"
                text
                icon
                color="gray"
                class="globeImageDiv"
              >
                <!-- <img alt="image" class="globeSmallImage" src="~/assets/images/globeSmallImage.png" /> -->
                <img
                  alt="image"
                  class="globeImage"
                  src="~/assets/images/globeImage.png"
                  @click="$emit('showPrivateIdeaDailog')"
                />
              </v-btn>

              <!-- Edit IDea Button-->
              <v-btn
                v-if="showEditIdeaBtn"
                outlined
                rounded
                color="gray"
                class="editIdeaBtn"
                @click="$emit('onEditIdea')"
              >
                MY IDEA <v-icon right>fas fa-pen</v-icon>
              </v-btn>
            </v-layout>

            <!-- Rightside Icons -->
            <v-flex xs3 sm3 class="rightSide" hidden-md-and-up>
              <v-btn text icon color="gray" class="saveIdeaBtn">
                <img
                  v-if="showUnSaveActionBtn"
                  class="unsaveIdea"
                  src="~/assets/images/unSaveIdeaImage.png"
                  @click="$emit('showSaveIdeaForMobileDailog')"
                />
                <!-- <img v-if="showSaveActionBtn" class="saveIdea" @click="$emit('showSaveIdeaForMobileDailog')" src="~/assets/images/saveIdeaImage.png" /> -->
              </v-btn>

              <!-- Search Idea Button -->
              <v-icon
                v-if="mobileSearchIcon"
                class="searchIconForMobile"
                @click="onShowSearchIdeaBox()"
                >fas fa-search</v-icon
              >

              <v-menu v-if="shareIdeaVisible" class="shareIdea">
                <template v-slot:activator="{ on }">
                  <v-icon class="icons menu" v-on="on"
                    >fas fa-ellipsis-v</v-icon
                  >
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
            </v-flex>
          </v-layout>
        </v-toolbar>

        <!-- Mobile search toolbar -->
        <v-toolbar
          v-else
          flat
          absolute
          color="white"
          class="mobile searchIdeaContainer"
          hidden-md-and-up
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
import MobileMenu from '@/components/menuComponent'
export default {
  components: { MobileMenu },
  props: {
    showUnSaveActionBtn: {
      type: Boolean,
      default: false
    },
    showPrivateIdeaBtn: {
      type: Boolean,
      default: false
    },
    showSaveActionBtn: {
      type: Boolean,
      default: false
    },
    showEditIdeaBtn: {
      type: Boolean,
      default: false
    },
    desktopSearchIcon: {
      type: Boolean,
      default: true
    },
    desktopMenuVisible: {
      type: Boolean,
      default: false
    },

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
      searchIdeaMode: false,
      searchModeForDesktop: false,
      openDesktopMenu: null
      // items: [
      //   { title: 'Home', icon: 'dashboard' },
      //   { title: 'About', icon: 'question_answer' }
      // ]
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

      .desktopMenu {
        margin-right: 20px;
        margin-top: -9px;
        font-size: 20px;
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

      .searchIcon {
        // border: 0.8px solid #7777;

        .desktopSeachIcon {
          margin-right: 20px;
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

    .menuOfDesktop {
      background: rgb(35, 16, 49) !important;
      z-index: 999;

      .backBtn {
        margin: 10px 10px;
        cursor: pointer;
      }

      .logoContainer {
        margin-top: 4vh;
        margin-bottom: 3vh;
        text-align: center;
        img {
          width: 70%;
          margin-top: 3vh;
        }
      }

      // display: none;
      .v-list-item {
        .v-list-item__content {
          height: 7vh;
          cursor: pointer;
          border-bottom: 1px solid #827c852e !important;

          .nuxt-link-exact-active.nuxt-link-active {
            text-decoration: none;
          }

          .v-list-item__title {
            font-size: 15px;
            text-align: center;
            color: white;

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
        .v-list-item__content {
          border-bottom: none !important;
          height: auto;
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
          text-align: right !important;
          // padding-left: 45px;
          margin-top: 10px;
          font-size: 14px;
          font-weight: 600;
          line-height: 1.57;
          color: #18141c;
        }
        .globeImageDiv {
          margin-right: 40px;
          .globeSmallImage {
            height: 17px;
          }

          .globeImage {
            height: 17px;
          }
        }

        .editIdeaBtn {
          color: #87818a !important;
          margin-top: 10px;
          margin-right: 20px;
          i {
            color: #87818a !important;
          }
        }

        .icons {
          color: #c0b7c5 !important;
          font-size: 16px;
          margin-top: 16px;
        }

        .rightSide {
          text-align: right;

          .saveIdeaBtn {
            margin-right: 5px;
            // display: none;
          }

          .searchIconForMobile {
            // margin-left: 60px;
            font-size: 14px;
          }

          i {
            color: #35124e !important;
            padding-bottom: 0px;
            text-align: right;
            // margin-right: 6px;
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
