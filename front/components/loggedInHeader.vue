<template>
  <div class="loggedInHeader">
    <!-- Desktop Header -->
    <v-layout hidden-sm-and-down>
      <v-app-bar class="desktop" app flat absolute color="white">
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
          <span class="userName">{{ $store.getters['cognito/username'] }}</span>
          <span class="userIcon">
            <v-icon>fas fa-user</v-icon>
          </span>
        </template>
      </v-app-bar>
    </v-layout>

    <!-- Mobile HEader -->
    <v-app-bar app flat absolute color="white" hidden-md-and-up>
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
        <v-flex xs8 sm8 class="text">{{ mobileTitle }}</v-flex>

        <!-- Rightside Icons -->
        <v-flex xs2 sm2 class="rightSide">
          <v-icon v-if="mobileSearchIcon" class="icons menu"
            >fas fa-search</v-icon
          >
          <v-icon v-else class="icons menu">fas fa-ellipsis-v</v-icon>
        </v-flex>
      </v-layout>
    </v-app-bar>
  </div>
</template>
<script>
import MobileMenu from '~/components/menuComponent'
export default {
  components: { MobileMenu },
  props: {
    backButton: {
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
    }
  },
  data: () => ({}),
  methods: {
    onBackClick() {
      this.$router.back()
    }
  }
}
</script>
<style lang="scss">
.loggedInHeader {
  width: 100%;
  background: white !important;

  .desktop {
    z-index: 500;
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
      font-size: 13px;
    }
    .rightSide {
      text-align: right;
      i {
        // color: #35124e !important;
      }
    }
  }
}
</style>
