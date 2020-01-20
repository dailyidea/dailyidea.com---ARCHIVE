<template>
  <div class="noIdeaFoundDiv">
    <div>
      <img class="lampImg" src="~/assets/images/light_gray_lamp_plain.png" />
    </div>

    <!-- No Idea MEssage -->
    <div class="text" v-html="noIdeaMessage"></div>

    <!-- Add idea arrow - desktop only -->
    <v-layout
      v-if="showArrowToAddButton"
      class="hidden-sm-and-down desktopArrowButtonContainer"
    >
      <img class="arrowImg" src="~/assets/images/add_idea_arrow_desktop.png" />
    </v-layout>

    <v-layout
      v-if="showArrowToAddButton"
      class="hidden-md-and-up mobileArrowButtonContainer"
    >
      <img class="arrowImg" src="~/assets/images/add_idea_arrow_mobile.png" />
    </v-layout>
  </div>
</template>

<script>
export default {
  name: 'IdeasListEmptyMessage',
  props: {
    showArrowToAddButton: {
      type: Boolean,
      default: false
    },
    noIdeaMessage: {
      type: String,
      default: `You don't have any ideas right now. <br /> Or do you?`
    }
  }
}
</script>

<style scoped lang="scss">
.noIdeaFoundDiv {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-content: stretch;
  align-items: center;

  .lampImg {
    margin-top: 10vh;
    height: 20vh;

    @media #{$small-screen} {
      margin-top: 13vh;
      height: 25vh;
    }
  }

  .text {
    margin-top: 4vh;
    margin-bottom: 3vh;
    font-size: 16px;
    color: #c0b7c5;
  }

  .desktopArrowButtonContainer {
    $arrowHeight: 29vh;
    position: relative;
    width: 100%;
    height: $arrowHeight;

    .arrowImg {
      height: $arrowHeight;
      position: absolute;
      bottom: 0;
      right: -30%;
      width: 80%;
      overflow-x: hidden;
    }
  }

  .mobileArrowButtonContainer {
    $arrowHeight: 31vh;
    position: relative;
    width: 100%;
    height: $arrowHeight;

    .arrowImg {
      height: $arrowHeight;
      position: absolute;
      left: 40%;
    }
  }
}
</style>
