<template>
  <div class="ideaListComponent" wrap>
    <div v-if="ideas && ideas.length > 0">
      <v-flex v-for="(idea, index) in ideas" :key="index" class="ideaContainer">
        <div
          class="ideaItem"
          @click="
            $router.push({
              name: 'ideas-userId-ideaId',
              params: {
                ideaId: idea.ideaId,
                userId: idea.userId
              },
              force: true
            })
          "
        >
          <div class="ideaTitle">{{ idea.title }}</div>

          <!-- Desktop only - idea description -->
          <div class="ideaDescrpition" hidden-sm-and-down>
            <v-layout v-html="idea.content"> </v-layout>
          </div>

          <div class="engagement">
            <div class="ups">
              <img class="logoIcon" src="~/assets/images/logo_icon.png" />
              {{ idea.likesCount }}
            </div>
            <div class="downs">
              <img class="logoIcon" src="~/assets/images/comments.png" />
              120
            </div>

            <div class="timing">{{ idea.relativeCreatedTime }}</div>
          </div>
        </div>
      </v-flex>
    </div>

    <!-- No Idea found -->
    <div v-else class="noIdeaFoundDiv">
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
        <img
          class="arrowImg"
          src="~/assets/images/add_idea_arrow_desktop.png"
        />
      </v-layout>

      <v-layout
        v-if="showArrowToAddButton"
        class="hidden-md-and-up mobileArrowButtonContainer"
      >
        <img class="arrowImg" src="~/assets/images/add_idea_arrow_mobile.png" />
      </v-layout>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    ideas: {
      type: Array,
      default: null
    },
    showArrowToAddButton: {
      type: Boolean,
      default: false
    },
    noIdeaMessage: {
      type: String,
      default: "You don't have any ideas right now. <br /> Or do you?"
    }
  }
}
</script>

<style lang="scss" scoped>
.ideaListComponent {
  margin-left: 25%;
  margin-right: 25%;

  @media #{$small-screen} {
    padding-right: 0%;
    padding-left: 0%;
    margin-left: 0%;
    margin-right: 0%;
  }

  .ideaContainer {
    padding: 10px 10px;

    @media #{$small-screen} {
      padding: 0px !important;
      &:last-child {
        border-bottom: solid 1px rgba(228, 228, 228, 0.38);
      }
    }

    .ideaItem {
      border: solid 1px rgba(228, 228, 228, 0.38);
      padding: 15px 20px;
      cursor: pointer !important;

      overflow-wrap: break-word;
      line-height: 1.5;

      @media #{$small-screen} {
        border-left: 0px;
        border-right: 0px;
        border-bottom: none;
        margin-top: 0px;
      }

      &:hover {
        -webkit-box-shadow: 0px 0px 5px 3px #e3e3e361;
        -moz-box-shadow: 0px 0px 5px 3px #e3e3e361;
        box-shadow: 0px 0px 5px 3px #e3e3e361;
      }

      .ideaTitle {
        overflow-wrap: break-word;
        margin-bottom: 10px;

        @media #{$small-screen} {
          min-height: 10px;
        }

        font-size: 16px;
        color: #18141c;
      }

      .ideaDescrpition {
        width: 100%;
        display: block;
        margin-bottom: 15px;

        @media #{$small-screen} {
          padding-top: 3px;
        }

        font-size: 14px;
        text-align: left;
        color: #827c85;
      }

      .engagement {
        display: block;
        margin-top: 10px;
        margin-bottom: 5px;
        font-size: 14px;
        text-align: left;
        color: #c0b7c5;

        img {
          height: 14px;
          margin-right: 5px;
        }

        .ups {
          display: inline-block;
          height: 18px;
        }

        .downs {
          margin-left: 20px;
          display: inline-block;
        }

        .timing {
          float: right;
          font-size: 12px;
          line-height: 1.83;
          color: #c0b7c5;
        }
      }
    }
  }

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
        overflow-x: hiden;
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
}
</style>
