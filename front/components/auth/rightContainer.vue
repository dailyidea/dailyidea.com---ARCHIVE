<template>
  <v-flex class="rightImgContainer" hidden-sm-and-down>
    <img class="smallTreeImage" src="~/assets/images/smallTree.png" />
    <img
      class="imgPersonWithPhone"
      src="~/assets/images/signup/lady_with_phone.png"
    />
  </v-flex>
</template>
<style lang="scss" scoped>
.rightImgContainer {
  position: relative;
  z-index: 10;
  .smallTreeImage {
    height: 90vh;
    position: absolute;
    left: 58%;
    bottom: 6vh;
  }
  .imgPersonWithPhone {
    height: 72vh;
    position: absolute;
    left: 20%;
    bottom: 3vh;
  }
}
</style>