<template>
  <Layout
    v-bind="{
      backButton: true,
      loggedInHeader: true,
      mobileTitle: '404',
      mobileHamburger: true,
      mobileSearchIcon: true
    }"
  >
    <v-layout id="pageNotFound">
      <div class="leftSide">
        <img class="backgroundLamp" src="~/assets/images/light_gray_lamp.png" />
        <div class="note1">
          404
        </div>
        <div class="note2">
          Grrreat....<br />
          Now you're stuck.<br />
          Go back, maybe?
        </div>
      </div>

      <div class="rightSide" style="width:100%;">
        <img class="imageOfBoy" src="~/assets/images/404.png" />
      </div>
    </v-layout>
  </Layout>
</template>

<script>
import Layout from '@/components/layout/Layout'

export default {
  components: { Layout }
}
</script>

<style lang="scss">
#pageNotFound {
  display: flex;
  background: white;
  .leftSide {
    flex: 1;
    .backgroundLamp {
      padding-top: 10px;
      position: absolute;
      width: 300px;
    }
    .note1 {
      padding-top: 30vh;
      text-align: center;
      font-size: 60px;
    }
    .note2 {
      text-align: center;
      font-size: 20px;
      color: #d4cdd7;
      padding-top: 5vh;
    }
  }

  .rightSide {
    height: 91vh;
    flex: 0.8;
    align-content: bottom;
    position: relative;
    overflow: hidden;

    .imageOfBoy {
      width: 100%;
      max-width: 550px;
      position: absolute;
      bottom: 0px;
      // right: 0px;
    }
  }
}
</style>
