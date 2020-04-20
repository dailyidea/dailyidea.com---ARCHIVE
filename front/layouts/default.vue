<template>
  <v-app id="app">
    <!-- <Layout> -->
    <Nuxt />
    <!-- </Layout> -->
  </v-app>
</template>
<script>
import '@fortawesome/fontawesome-free/css/all.css'

export default {
  components: {}
}
</script>

<style lang="scss">
@font-face {
  font-family: 'Avenir';
  src: url('~assets/fonts/Avenir/AvenirRoman.otf');
}

@font-face {
  font-family: 'QuatroBold';
  src: url('~assets/fonts/quatro_bold/dda013312f72e26a4bcc7df56fb8ce29.eot');
  /* IE9*/
  src: url('~assets/fonts/quatro_bold/dda013312f72e26a4bcc7df56fb8ce29.eot?#iefix')
      format('embedded-opentype'),
    /* IE6-IE8 */
      url('~assets/fonts/quatro_bold/dda013312f72e26a4bcc7df56fb8ce29.woff2')
      format('woff2'),
    /* chrome、firefox */
      url('~assets/fonts/quatro_bold/dda013312f72e26a4bcc7df56fb8ce29.woff')
      format('woff'),
    /* chrome、firefox */
      url('~assets/fonts/quatro_bold/dda013312f72e26a4bcc7df56fb8ce29.ttf')
      format('truetype'),
    /* chrome、firefox、opera、Safari, Android, iOS 4.2+*/
      url('~assets/fonts/quatro_bold/dda013312f72e26a4bcc7df56fb8ce29.svg#QuatroBold')
      format('svg');
  /* iOS 4.1- */
}

@font-face {
  font-family: 'Quatro';
  src: url('~assets/fonts/quatro_regular/17ae0aa7804ff40b20696df1008501d7.eot');
  /* IE9*/
  src: url('~assets/fonts/quatro_regular/17ae0aa7804ff40b20696df1008501d7.eot?#iefix')
      format('embedded-opentype'),
    /* IE6-IE8 */
      url('~assets/fonts/quatro_regular/17ae0aa7804ff40b20696df1008501d7.woff2')
      format('woff2'),
    /* chrome、firefox */
      url('~assets/fonts/quatro_regular/17ae0aa7804ff40b20696df1008501d7.woff')
      format('woff'),
    /* chrome、firefox */
      url('~assets/fonts/quatro_regular/17ae0aa7804ff40b20696df1008501d7.ttf')
      format('truetype'),
    /* chrome、firefox、opera、Safari, Android, iOS 4.2+*/
      url('~assets/fonts/quatro_regular/17ae0aa7804ff40b20696df1008501d7.svg#Quatro');
}

@font-face {
  font-family: 'QuatroLight';
  src: url('~assets/fonts/quatro_light/969b2305b96bde01825b0b368bc2c181.eot');
  /* IE9*/
  src: url('~assets/fonts/quatro_light/969b2305b96bde01825b0b368bc2c181.eot?#iefix')
      format('embedded-opentype'),
    /* IE6-IE8 */
      url('~assets/fonts/quatro_light/969b2305b96bde01825b0b368bc2c181.woff2')
      format('woff2'),
    /* chrome、firefox */
      url('~assets/fonts/quatro_light/969b2305b96bde01825b0b368bc2c181.woff')
      format('woff'),
    /* chrome、firefox */
      url('~assets/fonts/quatro_light/969b2305b96bde01825b0b368bc2c181.ttf')
      format('truetype'),
    /* chrome、firefox、opera、Safari, Android, iOS 4.2+*/
      url('~assets/fonts/quatro_light/969b2305b96bde01825b0b368bc2c181.svg#QuatroLight')
      format('svg');
  /* iOS 4.1- */
}

#app {
  font-family: Avenir, sans-serif;
  background: white;
}

.theme--light.v-application {
  background-color: #fff;
}

.theme--light.v-list-item {
  &:hover {
    background: #ffdf01;

    .v-list-item__title {
      color: #18141c;
    }
  }
}

/* light theme styles */
.theme--light.v-btn {
  background: $secondary-color !important;
  &[disabled] {
    opacity: 0.6;
  }
  box-shadow: none;
  color: white !important;

  &:hover {
    // background: #ffb92d !important;
  }
}

.theme--light.v-btn.v-btn--flat,
.theme--light.v-btn.v-btn--outlined {
  background: transparent !important;
  color: $primary-color !important;
}

.theme--light.v-btn.white--text {
  color: white !important;
}

/* dark theme styles */
.theme--dark.v-btn {
  background: $primary-color !important;
  color: white !important;

  &:hover {
    background: $primary-color !important;
  }
}

.theme--dark.v-btn.v-btn--flat,
.theme--dark.v-btn.v-btn--outlined {
  background: transparent !important;
  color: $primary-color;
}

/* Pink modal background */
.v-overlay.v-overlay--active {
  .v-overlay__scrim {
    opacity: 0.46 !important;
    background-color: #ecd9f7 !important;
    border-color: #707070 !important;
  }
}
</style>
