<template>
  <v-layout
      hidden-sm-and-down
      class="fixedFooter"
      :style="{
        'background-image':
          'url(' + require('~/assets/images/signup/footer_background.png') + ')'
      }"
    ></v-layout>
</template>
<style lang="scss" scoped>
.fixedFooter {
  height: 30vh;
  width: 100%;
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 0;
  // border: 1px solid red;
  background-size: cover;
  // background-position-y: 30px;
}
</style>