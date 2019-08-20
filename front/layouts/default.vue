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
  font-family: 'QuatroBold';
  src: url('/fonts/quatro_bold/dda013312f72e26a4bcc7df56fb8ce29.eot');
  /* IE9*/
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
      format('svg');
  /* iOS 4.1- */
}

@font-face {
  font-family: 'Quatro';
  src: url('/fonts/quatro_regular/17ae0aa7804ff40b20696df1008501d7.eot');
  /* IE9*/
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
  src: url('/fonts/quatro_light/969b2305b96bde01825b0b368bc2c181.eot');
  /* IE9*/
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
      format('svg');
  /* iOS 4.1- */
}

#app {
  font-family: Quatro;
}
</style>
