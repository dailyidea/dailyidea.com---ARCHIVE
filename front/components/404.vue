<template>
  <v-layout id="pageNotFound">
    <!--mobile view-->
    <v-layout inline-block class="mobile" hidden-md-and-up>
      <div>
        <img class="imageOfBoy" src="~/assets/images/404.png" />
        <div class="titleText">
          404
        </div>
        <div class="note2">
          Grrreat....<br />
          Now you're stuck.<br />
          Go back, maybe?
        </div>
      </div>
    </v-layout>

    <!--desktop view-->
    <v-layout class="desktop" hidden-sm-and-down>
      <div class="leftSide">
        <img class="backgroundLamp" src="~/assets/images/light_gray_lamp.png" />
        <div class="titleText">
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
  </v-layout>
</template>
<script>
import Layout from '@/components/layout/Layout'
export default {
  components: { Layout }
}
</script>
<style lang="scss">
#pageNotFound {
  background: white;

  .desktop {
    display: flex;
    min-height: 94vh;
    width: 100%;
    overflow: hidden;

    .leftSide {
      flex: 1;

      .backgroundLamp {
        padding-top: 10px;
        position: absolute;
        width: 300px;
      }

      .titleText {
        padding-top: 25vh;
        padding-left: 10%;
        text-align: center;
        font-size: 100px;
        z-index: 1;
      }

      .note2 {
        text-align: center;
        font-size: 20px;
        color: #d4cdd7;
        padding-top: 2vh;
        padding-left: 10%;
      }
    }

    .rightSide {
      height: 91vh;
      flex: 0.8;

      .imageOfBoy {
        width: 100%;
        max-width: 550px;
        position: absolute;
        bottom: 0px;
        background-color: white;

        @media #{$small-screen} {
          height: 52vh;
          position: absolute;
        }
      }
    }
  }

  .mobile {
    background: white;
    min-height: 80vh;

    .imageOfBoy {
      padding-top: 10px;
      position: fixed;
      width: 100%;
      bottom: 0px;
      background: white;
    }

    .titleText {
      padding-top: 3vh;
      padding-left: 15vh;
      text-align: center;
      font-size: 80px;
    }

    .note2 {
      text-align: center;
      padding-left: 15vh;
      font-size: 20px;
      color: #d4cdd7;
      padding-top: 2vh;
    }
  }
}
</style>
