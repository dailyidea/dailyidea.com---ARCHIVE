<template>
  <v-flex class="lefgImgContainer" hidden-sm-and-down>
    <img class="bigTreeImage" src="~/assets/images/bigTree.png" />
    <img
      class="imgPersonWithPhone"
      src="~/assets/images/person_with_phone.png"
    />
  </v-flex>
</template>
<style lang="scss" scoped>
.lefgImgContainer {
  position: relative;
  z-index: 10;

  .bigTreeImage {
    height: 75vh;
    position: absolute;
    left: -3%;
    top: 20vh;
  }

  .imgPersonWithPhone {
    height: 75vh;
    position: absolute;
    right: 10%;
    bottom: 3vh;
  }
}
</style>