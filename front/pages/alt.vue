<template>
  <Layout>
    <div id="homePage">
      <!-- First Section -->
      <div class="firstSection">
        <!-- Desktop - Hero Message & Signup Button -->
        <v-layout
          class="heroSection"
          fluid
          grid-list-md
          row
          :style="{
            'background-image':
              'url(' + require('~/assets/images/home/white_hero_bg.png') + ')'
          }"
        >
          <!-- Desktop Left Side -->
          <v-flex class="leftSide" md6 lg6 sm12>
            <div class="heroTitle">
              Every Day, Log An Idea
            </div>
            <div class="heroSubtitle">
              A project idea, a startup idea, a work idea
            </div>
            <div class="heroDescription">
              You'll get an email in your inbox reminding you to submit an idea.
              Just respond to it and we'll save it for you.
            </div>

            <!-- Signup Button -->
            <v-btn
              large
              dark
              class="signupButton"
              :to="{ name: 'auth-signup' }"
              color="primary"
              >Sign up Now</v-btn
            >
          </v-flex>

          <!-- Desktop Only - Right Side -->
          <v-flex hidden-sm-and-down>
            <!-- Lamp Image -->
            <div class="desktopHeroRightSideImageContainer">
              <img class="lampImg" src="~/assets/images/yellowBulb.png" />
              <img class="tree" src="~/assets/images/bigTree.png" />
              <img
                class="personImg person1Img"
                src="~/assets/images/home/person_with_bag.png"
              />
              <img
                class="personImg person2Img"
                src="~/assets/images/home/person_2.png"
              />
              <img
                class="personImg person3Img"
                src="~/assets/images/home/person_3.png"
              />
            </div>
          </v-flex>
        </v-layout>

        <!-- Desktop Reviews -->
        <div>
          <v-layout
            class="desktopReviews"
            :style="{
              'background-image':
                'url(' +
                require('~/assets/images/home/purple_background.png') +
                ')'
            }"
            hidden-sm-and-down
            fluid
            grid-list-md
            xs12
            row
          >
            <v-flex v-for="idea in ideas" :key="idea.ideaId" md4 lg4>
              <v-card color="white" class="review">
                <div v-html="idea.content"></div>
                <!-- User Icon -->
                <div class="reviewerInfo">
                  <v-icon class="userIcon">fa-user-circle</v-icon>by Name
                  Surname
                  <div class="reviewTime">{{ idea.createdDate | toRelativeDate }}</div>
                </div>
              </v-card>
            </v-flex>

            <!-- More Ideas Button -->
            <div class="moreIdeasButtonContainer">
              <v-btn large class="moreIdeas" to="/ideas/all" color="primary">
                Browse More Ideas
              </v-btn>
            </div>
          </v-layout>
        </div>

        <!-- Mobile Reviews -->
        <v-layout
          class="mobileReviews"
          hidden-md-and-up
          :style="{
            'background-image':
              'url(' +
              require('~/assets/images/home/purple_background_mobile.png') +
              ')'
          }"
        >
          <v-carousel
            interval="600000"
            hide-delimiter-background
            cycle
            :show-arrows="false"
            delimiter-icon="fa-circle"
            class="mobileReviewCrousel"
          >
            <v-carousel-item
              v-for="idea in ideas"
              :key="idea.ideaId"
              class="review"
            >
              <div v-html="idea.content"></div>
              <!-- User Icon -->
              <div class="reviewerInfo">
                <v-icon class="userIcon">fa-user-circle</v-icon>by Name Surname
                <div class="reviewTime">1h ago</div>
              </div>
            </v-carousel-item>
          </v-carousel>

          <img class="lampImg" src="~/assets/images/yellowBulb.png" />
          <img class="heroImg" src="~/assets/images/home/person_2_mobile.png" />
        </v-layout>
      </div>

      <!-- Second Section -->
      <div class="secondSection">
        <!-- Desktop View -->
        <v-container class="desktopView" hidden-sm-and-down>
          <v-layout row wrap>
            <!-- Left side image -->
            <v-flex class="leftImageSection" xs6>
              <img class="img1" src="~/assets/images/person_with_phone.png" />
              <img class="img2" src="~/assets/images/home/mail_work.png" />
              <img
                class="img3"
                src="~/assets/images/home/lady_with_phone.png"
              />
            </v-flex>
            <!-- Right side description -->
            <v-flex class="rightSideDescription" xs5 md6>
              <div class="ttle">How it works</div>
              <div class="subTitle">Oh, it's easy!</div>
              <img class="dotsImg" src="~/assets/images/home/dots.png" />
              <div class="description">
                We'll send you an email every day with a reminder for you to
                submit an idea. Just hit reply, and you'll never again.
              </div>
              <v-btn class="buttn" dark outlined>More</v-btn>
            </v-flex>
          </v-layout>
        </v-container>

        <!-- Mobile View -->
        <v-container class="mobileView" grid-list-md hidden-md-and-up>
          <div class="ttle">How it works</div>
          <div class="subTitle">
            Oh, it's easy!
            <img class="dotsImg" src="~/assets/images/home/dots.png" />
          </div>
          <div class="description">
            We'll send you an email every day with a <br />reminder for you to
            submit an idea. Just hit <br />reply, and you'll never forget an
            idea ever <br />
            again.
          </div>

          <div style="text-align: center;">
            <img
              class="ladyMobile"
              src="~/assets/images/home/lady_with_phone.png"
            />
            <img class="img2" src="~/assets/images/home/mail_work_mobile.png" />
            <img class="img3" src="~/assets/images/person_with_phone.png" />
          </div>
          <v-btn class="buttn" dark outlined>More</v-btn>
        </v-container>

        <!-- Footer -->
        <div class="homeFooter">
          <v-layout row wrap>
            <v-flex md10 lg10 hidden-sm-and-down>&nbsp;</v-flex>
            <v-flex md2 lg2>
              <i class="fab fa-instagram"></i>
              <i class="fab fa-twitter"></i>
              <i class="fab fa-facebook-f"></i>
            </v-flex>
          </v-layout>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script>
import Layout from '@/components/layout/Layout'
import getPublicIdeas from '~/graphql/query/getPublicIdeas'

export default {
  components: { Layout },
  async asyncData({ app }) {
    let result = await app.$amplifyApi.graphql({
      query: getPublicIdeas,
      variables: {
        nextToken: null,
        limit: 3
      },
      authMode: 'API_KEY'
    })

    result = result.data.getPublicIdeas
    return {
      ideas: result.items
    }
  },
  created() {
  },
  methods: {}
}
</script>

<style lang="scss">
#homePage {
  .firstSection {
    width: 100%;
    text-align: left;
    background: white;
    overflow: hidden;

    .heroSection {
      background-size: cover;
      background-position-y: -20px;
      height: 90vh;

      // border: 1px solid green;

      background: #ebe7ed;
      background-repeat: no-repeat;
      background-size: 230% 70vh;
      background-position-x: 82%;

      .leftSide {
        text-align: left;
        padding-left: 10%;
        z-index: 1;

        font-family: QuatroLight;
        font-weight: 600;
        color: #18141c;

        .heroTitle {
          padding-top: 15vh;
          font-size: 55px;
          line-height: 1.2;
        }

        .heroSubtitle {
          margin-top: 3vh;
          font-size: 25px;
          line-height: 0.73;
        }

        .heroDescription {
          padding-top: 4vh;
          width: 70%;
          font-size: 20px;
          line-height: 1.5;
          color: #827c85;
        }

        .signupButton {
          width: 220px;
          font-size: 13px;
          margin-top: 8.5vh;
          margin-bottom: 2vh;
        }
      }

      .desktopHeroRightSideImageContainer {
        // border: 1px solid red;
        position: relative;
        height: 100%;
        img {
          position: absolute;
          bottom: 0;
        }

        .lampImg {
          position: absolute;
          top: 3vh;
          left: 25%;
          height: 27vh;
        }

        .tree {
          left: 0;
          height: 80vh;
          left: -15%;
          z-index: 0;
        }

        .person1Img {
          left: 5%;
          width: 18%;
        }

        .person2Img {
          left: 30%;
          width: 18%;
        }

        .person3Img {
          left: 52%;
          width: 24%;
        }
      }

      @media #{$small-screen} {
        background-size: 275% 70vh;
        background-position-x: 95%;
        background-position-x: 70%;
        height: 75vh;

        .leftSide {
          padding-left: 7%;
          padding-right: 30%;

          .heroTitle {
            padding-top: 5vh;
            font-size: 35px;
          }

          .heroSubtitle {
            margin-top: 3vh;
            font-size: 20px;
            padding-right: 10%;
            line-height: 1.2;
          }

          .heroDescription {
            padding-top: 4vh;
            font-size: 15px;
            width: 100%;
            padding-right: 10%;
            line-height: 1.5;
            color: #827c85;
          }

          .signupButton {
            width: 170px;
            font-size: 13px;
            margin-top: 8.5vh;
            margin-bottom: 2vh;
          }
        }
      }
    }

    .desktopReviews {
      // border: 1px solid blue;
      margin: auto;
      margin-top: -13vh;
      padding-bottom: 10vh;
      width: 100%;
      padding-left: 8%;
      padding-right: 8%;

      background: #ebe7ed;
      background-size: cover;
      background-position-y: 30px;
      text-align: center;

      .review {
        max-width: 400px !important;
        width: 90%;
        padding: 40px 33px;
        font-size: 16px;
        margin: auto;
        text-align: left;

        .reviewerInfo {
          font-size: 13px;
          color: #777;
          line-height: 30px;
          margin-top: 30px;

          .userIcon {
            color: #35124e;
            font-size: 25px;
            line-height: 20px;
            margin-right: 10px;
          }

          .reviewTime {
            float: right;
          }
        }
      }

      .moreIdeasButtonContainer {
        width: 100%;
        text-align: center;
        margin-top: 10vh;
        // border: 1px solid red;

        .moreIdeas {
          text-align: center;
          width: 350px;
        }
      }
    }

    .mobileReviews {
      padding-bottom: 7vh;
      background-size: cover;
      background-position-y: 10vh;
      background-color: #ebe7ed;
      position: relative;

      .lampImg {
        position: absolute;
        right: 5%;
        top: -60vh;
        width: 27%;
        z-index: 0;
      }

      .heroImg {
        position: absolute;
        right: 0px;
        top: -40vh;
        width: 42%;
        z-index: 0;
      }

      .mobileReviewCrousel {
        // border: 1px solid red;
        width: 90%;
        margin: auto;
        background: white;
        margin-top: 25px;
        padding-bottom: 10px;
        z-index: 10;

        height: auto !important;

        .v-carousel__item {
          min-height: 100px;
          height: auto !important;
          padding-bottom: 55px;
        }
        .v-carousel__controls {
          padding-bottom: 5vh !important;
          padding-top: 4vh !important;

          .v-icon {
            color: #777 !important;
            font-size: 11px !important;
          }

          .v-btn--active {
            background-color: white !important;

            .v-icon {
              color: #ffc61e !important;
            }
          }
        }

        .review {
          padding: 32px 32px;
          padding-bottom: 0px;
          font-size: 18px;
          height: auto !important;
          margin: auto;

          .reviewerInfo {
            color: #777;
            line-height: 30px;
            margin-top: 20px;

            .userIcon {
              color: #35124e;
              font-size: 25px;
              line-height: 20px;
              margin-right: 10px;
            }

            .reviewTime {
              float: right;
            }
          }
        }
      }
    }
  }

  .secondSection {
    text-align: left;
    padding-top: 0vh;
    overflow: hidden;
    position: relative;

    .desktopView {
      .leftImageSection {
        display: flex; // make us of Flexbox
        align-items: center;
        justify-content: center;
        text-align: center;
        position: relative;

        .img1 {
          position: absolute;
          overflow: hidden;
          height: 100vh;
          top: 1vh;
          left: -4%;
        }

        .img2 {
          width: 70%;
        }

        .img3 {
          position: absolute;
          overflow: hidden;
          height: 60vh;
          top: 5vh;
          right: 13%;
        }
      }

      .rightSideDescription {
        padding-top: 7vh;

        .ttle {
          color: #ffc61e;
          font-style: italic;
          font-size: 2vw;
          line-height: 2.3vw;
        }

        .subTitle {
          font-size: 4vw;
        }

        .dotsImg {
          margin-top: 2vh;
          height: 10px;
        }

        .description {
          width: 80%;
          padding-top: 4vh;
          font-size: 1.3vw;
          padding-left: 5px;
          color: #aca7ae;
        }

        .buttn {
          margin-top: 7vh;
          margin-bottom: 5vh;
        }
      }
    }

    .mobileView {
      padding: 6vh 8% 0vh 10%;
      position: relative;
      overflow: hidden;

      .ttle {
        font-family: QuatroSlab;
        font-size: 14px;
        font-weight: normal;
        font-style: italic;
        font-stretch: normal;
        line-height: 1.57;
        letter-spacing: 0.42px;
        text-align: left;
        color: #ffbd27;
      }

      .subTitle {
        font-size: 9vw;
        margin-top: 2vh;
        position: relative;

        .dotsImg {
          position: absolute;
          right: 4%;
          top: 22px;
          width: 60px;
        }
      }

      .description {
        width: 70%;
        padding-top: 3vh;
        padding-left: 5px;

        font-family: Quatro;
        font-size: 12px;
        font-weight: normal;
        font-style: normal;
        font-stretch: normal;
        line-height: 1.83;
        letter-spacing: normal;
        text-align: left;
        color: #827c85;
      }

      .buttn {
        // margin-top: 30vh;
      }

      .ladyMobile {
        position: absolute;
        bottom: 13vh;
        left: 23px;
        height: 263px;
      }

      .img2 {
        width: 70%;
        margin: auto;
      }

      .img3 {
        position: absolute;
        height: 670px;
        right: -65px;
        bottom: -250px;
      }
    }

    .buttn {
      margin-top: 8vh;
      margin-bottom: 4vh;
      color: #3a1852 !important;
      border: 2px solid #cbc4cf !important;
    }
  }

  .homeFooter {
    background: white;
    color: white;
    padding: 30px;
    // padding-top: 20px;

    i {
      color: #35124e;
      margin-left: 13px;
      margin-right: 13px;
    }
  }
}
</style>
