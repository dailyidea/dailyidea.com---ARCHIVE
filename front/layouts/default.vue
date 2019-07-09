<template>
  <v-app id="app">
    <v-toolbar class="toolBar" app flat absolute>
      <v-toolbar-title class="blue--text subheading">
        <nuxt-link class="logoLink" :to="{ name: 'index' }">
          <img class="logoIcon" src="~/assets/images/logo_icon.png" />
          <img class="logoIcon logoText" src="~/assets/images/logo_text.png" />
        </nuxt-link>
      </v-toolbar-title>
      <v-spacer />
      <template v-if="!$store.getters['cognito/isLoggedIn']">
        <nuxt-link class="helpLink" :to="{ name: 'auth-login' }"
          >Help</nuxt-link
        >
        <nuxt-link class="userLink" :to="{ name: 'auth-signup' }">
          <v-icon>fa-user</v-icon>
        </nuxt-link>
      </template>
      <template v-else>
        <a @click="logout">Logout</a>
      </template>
    </v-toolbar>
    <v-content>
      <v-layout>
        <v-flex>
          <nuxt />
        </v-flex>
      </v-layout>
      <vue-snotify />
    </v-content>
    <!-- <v-footer app>
      <span>Dailyidea &copy; 2018</span>
    </v-footer> -->
  </v-app>
</template>
<script>
export default {
  methods: {
    logout() {
      this.$store.dispatch('cognito/signOut')
    }
  }
}
</script>
<style lang="scss">
@font-face {
  font-family: 'QuatroBold';
  src: url('/fonts/quatro_bold/dda013312f72e26a4bcc7df56fb8ce29.eot'); /* IE9*/
  src: url('/fonts/quatro_bold/dda013312f72e26a4bcc7df56fb8ce29.eot?#iefix')
      format('embedded-opentype'),
    /* IE6-IE8 */
      url('/fonts/quatro_bold/dda013312f72e26a4bcc7df56fb8ce29.woff2')
      format('woff2'),
    /* chrome、firefox */
      url('/fonts/quatro_bold/dda013312f72e26a4bcc7df56fb8ce29.woff')
      format('woff'),
    /* chrome、firefox */
      url('/fonts/quatro_bold/dda013312f72e26a4bcc7df56fb8ce29.ttf')
      format('truetype'),
    /* chrome、firefox、opera、Safari, Android, iOS 4.2+*/
      url('/fonts/quatro_bold/dda013312f72e26a4bcc7df56fb8ce29.svg#QuatroBold')
      format('svg'); /* iOS 4.1- */
}

@font-face {
  font-family: 'Quatro';
  src: url('/fonts/quatro_regular/17ae0aa7804ff40b20696df1008501d7.eot'); /* IE9*/
  src: url('/fonts/quatro_regular/17ae0aa7804ff40b20696df1008501d7.eot?#iefix')
      format('embedded-opentype'),
    /* IE6-IE8 */
      url('/fonts/quatro_regular/17ae0aa7804ff40b20696df1008501d7.woff2')
      format('woff2'),
    /* chrome、firefox */
      url('/fonts/quatro_regular/17ae0aa7804ff40b20696df1008501d7.woff')
      format('woff'),
    /* chrome、firefox */
      url('/fonts/quatro_regular/17ae0aa7804ff40b20696df1008501d7.ttf')
      format('truetype'),
    /* chrome、firefox、opera、Safari, Android, iOS 4.2+*/
      url('/fonts/quatro_regular/17ae0aa7804ff40b20696df1008501d7.svg#Quatro');
}

@font-face {
  font-family: 'QuatroLight';
  src: url('/fonts/quatro_light/969b2305b96bde01825b0b368bc2c181.eot'); /* IE9*/
  src: url('/fonts/quatro_light/969b2305b96bde01825b0b368bc2c181.eot?#iefix')
      format('embedded-opentype'),
    /* IE6-IE8 */
      url('/fonts/quatro_light/969b2305b96bde01825b0b368bc2c181.woff2')
      format('woff2'),
    /* chrome、firefox */
      url('/fonts/quatro_light/969b2305b96bde01825b0b368bc2c181.woff')
      format('woff'),
    /* chrome、firefox */
      url('/fonts/quatro_light/969b2305b96bde01825b0b368bc2c181.ttf')
      format('truetype'),
    /* chrome、firefox、opera、Safari, Android, iOS 4.2+*/
      url('/fonts/quatro_light/969b2305b96bde01825b0b368bc2c181.svg#QuatroLight')
      format('svg'); /* iOS 4.1- */
}

#app {
  font-family: Quatro;
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
        height: 24px;
      }

      .logoText {
        margin-top: 4px;
        height: 19px;
      }
    }
  }
}
</style>
