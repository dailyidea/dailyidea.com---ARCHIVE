<template>
  <v-toolbar class="loggedInHeader" app flat absolute>
    <v-toolbar-title class="blue--text subheading">
      <nuxt-link class="logoLink" :to="{ name: 'index' }">
        <img class="logoIcon" src="~/assets/images/logo_icon.png" />
        <img class="logoIcon logoText" src="~/assets/images/logo_text.png" />
      </nuxt-link>
    </v-toolbar-title>

    <!-- Search Box -->
    <v-text-field
      class="searchInput"
      flat
      solo
      label=""
      prepend-inner-icon="fas fa-search"
    ></v-text-field>

    <v-spacer />
    <template>
      <v-icon style="color: #c0b7c5;">fas fa-cog</v-icon>
      <span class="userName">Bob Smith</span>
      <span class="userIcon">
        <v-icon>fas fa-user</v-icon>
      </span>
    </template>
  </v-toolbar>
</template>
<script>
export default {
  data: () => ({}),
  methods: {}
}
</script>
<style lang="scss">
@import './assets/style/variables.scss';

.loggedInHeader {
  background: white !important;
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
    border: solid 1px rgba(187, 187, 187, 0.38);
    padding: 0px;
    margin-left: 12%;
    width: 40%;

    .v-input__control {
      min-height: 35px;
      height: 30px;
      //   padding: 5px;

      .v-input__slot {
        border: none;
        padding-left: 5px;

        .v-icon {
          font-size: 20px !important;
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
</style>
