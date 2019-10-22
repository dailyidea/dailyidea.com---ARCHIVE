<template>
  <Layout>
    <div id="homePage">
      <!-- First Section -->
      <div class="firstSection">
        <!-- Desktop - Hero Message & Signup Button -->
        <v-layout class="desktopHero" fluid grid-list-md hidden-sm-and-down row :style="{
            'background-image':
              'url(' +
              require('~/assets/images/home/yellow_background.png') +
              ')'
          }">
          <v-flex hidden-sm-and-down md7 lg6>
            <div class="heroTitle">
              Every Day, Log An Idea
            </div>
            <div class="heroSubtitle">A project idea, a startup idea, a work idea</div>
            <div class="heroDescription">
              You'll get an email in your inbox reminding you to submit an idea. Just respond to it and we'll save it for you.
            </div>

            <!-- Signup Button -->
            <v-btn large dark class="signupButton" :to="{ name: 'auth-signup' }" color="primary">Sign up Now</v-btn>

            <!-- Lamp Image -->
            <img class="lampImg" src="~/assets/images/white_lamp.png" />
          </v-flex>
        </v-layout>

        <!-- Mobile - Hero Message & Signup Button -->
        <v-layout class="mobileHero" hidden-md-and-up :style="{
            'background-image':
              'url(' +
              require('~/assets/images/home/yellow_background_mobile.png') +
              ')'
          }">
          <div class="heroTitle">
            Your Idea
            <br />Could Be Huge!
          </div>
          <div class="heroSubtitle">That is, if you don't forget it!</div>
          <div class="heroDescription">
            Submitting an idea every day is as simple as sending an email. We
            will store your ideas for you, so you can share them with your
            friends and conquer the world!
          </div>

          <!-- Signup Button -->
          <v-btn large dark class="signupButton" :to="{ name: 'auth-signup' }" color="primary">Sign up Now</v-btn>

          <img class="lampImg" src="~/assets/images/white_lamp.png" />
        </v-layout>

        <!-- Desktop Reviews -->
        <div>
          <v-layout class="desktopReviews" :style="{
              'background-image':
                'url(' +
                require('~/assets/images/home/purple_background.png') +
                ')'
            }" hidden-sm-and-down fluid grid-list-md xs12 row>
            <v-flex md4 lg4>
              <v-card color="white" class="review">
                Excepteur sint occaecat cuidatat non proident, sunt in culpa qui
                officia deserunt
                <!-- User Icon -->
                <div class="reviewerInfo">
                  <v-icon class="userIcon">fa-user-circle</v-icon>by Name
                  Surname
                  <div class="reviewTime">1h ago</div>
                </div>
              </v-card>
            </v-flex>
            <v-flex md4 lg4>
              <v-card color="white" class="review">
                Excepteur sint occaecat cuidatat non proident, sunt in culpa qui
                officia deserunt
                <!-- User Icon -->
                <div class="reviewerInfo">
                  <v-icon class="userIcon">fa-user-circle</v-icon>by Name
                  Surname
                  <div class="reviewTime">1h ago</div>
                </div>
              </v-card>
              <div class="browseMoreIdeaBtn">
                <v-btn large>Browse More Ideas</v-btn>
              </div>
            </v-flex>
            <v-flex md4 lg4 style="position: relative;">
              <img class="person2Img" src="~/assets/images/home/person_2.png" />
              <img class="person3Img" src="~/assets/images/home/person_3.png" />
              <v-card color="white" class="review">
                Excepteur sint occaecat cuidatat non proident, sunt in culpa qui
                officia deserunt
                <!-- User Icon -->
                <div class="reviewerInfo">
                  <v-icon class="userIcon">fa-user-circle</v-icon>by Name
                  Surname
                  <div class="reviewTime">1h ago</div>
                </div>
              </v-card>
            </v-flex>
          </v-layout>
        </div>

        <!-- Mobile Reviews -->
        <v-layout class="mobileReviews" hidden-md-and-up :style="{
            'background-image':
              'url(' +
              require('~/assets/images/home/purple_background_mobile.png') +
              ')'
          }">
          <v-carousel interval="600000" :show-arrows="false" delimiter-icon="fa-circle" class="mobileReviewCrousel">
            <v-carousel-item class="review">
              Excepteur sint occaecat cuidatat non proident, sunt in culpa qui
              officia deserunt
              <!-- User Icon -->
              <div class="reviewerInfo">
                <v-icon class="userIcon">fa-user-circle</v-icon>by Name Surname
                <div class="reviewTime">1h ago</div>
              </div>
            </v-carousel-item>
            <v-carousel-item class="review">
              Excepteur sint occaecat cuidatat non proident, sunt in culpa qui
              officia deserunt
              <!-- User Icon -->
              <div class="reviewerInfo">
                <v-icon class="userIcon">fa-user-circle</v-icon>by Name Surname
                <div class="reviewTime">1h ago</div>
              </div>
            </v-carousel-item>
            <v-carousel-item class="review">
              Excepteur sint occaecat cuidatat non proident, sunt in culpa qui
              officia deserunt
              <!-- User Icon -->
              <div class="reviewerInfo">
                <v-icon class="userIcon">fa-user-circle</v-icon>by Name Surname
                <div class="reviewTime">1h ago</div>
              </div>
            </v-carousel-item>
            <v-carousel-item class="review">
              Excepteur sint occaecat cuidatat non proident, sunt in culpa qui
              officia deserunt
              <!-- User Icon -->
              <div class="reviewerInfo">
                <v-icon class="userIcon">fa-user-circle</v-icon>by Name Surname
                <div class="reviewTime">1h ago</div>
              </div>
            </v-carousel-item>
          </v-carousel>

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
              <img class="img3" src="~/assets/images/home/lady_with_phone.png" />
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
            <img class="ladyMobile" src="~/assets/images/home/lady_with_phone.png" />
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
export default {
  components: { Layout },
  methods: {}
}
</script>

<style lang="scss">
#homePage {
  .firstSection {
    width: 100%;
    min-height: 100vh;
    text-align: left;
    background: ebe7ed;

    .desktopHero {
      padding-left: 11.5%;
      background-size: cover;
      background-position-y: -20px;

      .heroTitle {
        padding-top: 7vh;

        font-size: 75px;
        font-family: QuatroLight;
        font-weight: 600;
        font-style: normal;
        font-stretch: normal;
        line-height: 1.2;
        letter-spacing: normal;
        text-align: left;
        color: #18141c;
      }

      .heroSubtitle {
        margin-top: 3vh;
        padding-left: 5px;

        font-family: QuatroLight;
        font-size: 25px;
        font-weight: 600;
        font-style: normal;
        font-stretch: normal;
        line-height: 0.73;
        letter-spacing: normal;
        text-align: left;
        color: #18141c;
      }

      .heroDescription {
        padding-left: 5px;
        padding-top: 4vh;
        width: 63%;

        // font-family: QuatroLight;
        font-size: 20px;
        font-weight: normal;
        font-style: normal;
        font-stretch: normal;
        line-height: 1.5;
        letter-spacing: normal;
        text-align: left;
        color: #18141c;
      }

      .signupButton {
        width: 220px;
        font-size: 13px;
        margin-top: 8.5vh;
        margin-bottom: 2vh;
      }

      .lampImg {
        position: absolute;
        right: 21%;
        top: 3vh;
        height: 190px;
      }
    }

    .mobileHero {
      display: block;
      width: 100%;
      padding-left: 7%;
      padding-right: 7%;
      padding-bottom: 1vh;
      margin: auto;
      background-size: cover;
      background-position-x: 90%;
      background-position-y: 0px;
      position: relative;
      overflow-x: hidden;
      overflow-y: hidden;

      .heroTitle {
        width: 70%;
        padding-top: 11vh;
        display: block;

        font-family: QuatroSlab;
        font-size: 50px;
        font-weight: 600;
        font-style: normal;
        font-stretch: normal;
        line-height: 1;
        letter-spacing: normal;
        text-align: left;
        color: #18141c;
      }

      .heroSubtitle {
        margin-top: 3vh;
        padding-left: 5px;

        font-family: QuatroSlab;
        font-size: 14px;
        font-weight: 600;
        font-style: normal;
        font-stretch: normal;
        line-height: 1.57;
        letter-spacing: normal;
        text-align: left;
        color: #18141c;
      }

      .heroDescription {
        padding-left: 5px;
        padding-top: 3vh;
        width: 54%;
        text-align: left;

        font-family: Quatro;
        font-size: 14px;
        font-weight: normal;
        font-style: normal;
        font-stretch: normal;
        line-height: 1.57;
        letter-spacing: normal;
        text-align: left;
        color: #ffffff;
      }

      .signupButton {
        width: 150px;
        font-size: 13px;
        margin-top: 40px;
      }

      .lampImg {
        position: absolute;
        right: -2%;
        top: 3vh;
        height: 170px;
      }
    }

    .desktopReviews {
      padding-left: 10px;
      width: 100%;
      padding-left: 10%;
      padding-right: 10%;
      margin: auto;
      margin-top: 7vh;
      padding-bottom: 10vh;
      background-size: cover;
      background-position-y: 30px;

      .browseMoreIdeaBtn {
        text-align: center;
        margin-top: 80px;

        button {
          width: 400px;
        }
      }

      .person2Img {
        position: absolute;
        margin-top: -300px;
        right: 163px;
        height: 450px;
      }

      .person3Img {
        position: absolute;
        right: -34px;
        margin-top: -342px;
        height: 480px;
      }

      .review {
        max-width: 400px !important;
        width: 90%;
        padding: 40px 33px;
        font-size: 16px;
        margin: auto;

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
    }

    .mobileReviews {
      padding-bottom: 7vh;
      background-size: cover;
      background-position-y: 10vh;
      position: relative;

      .heroImg {
        position: absolute;
        right: 0px;
        // top: -38vh;
        top: -300px;
        // height: 71vh;
        width: 45%;
        z-index: 0;
      }

      .mobileReviewCrousel {
        // border: 1px solid red;
        width: 90%;
        margin: auto;
        max-height: 33vh;
        background: white;
        margin-top: 25px;
        padding-bottom: 10px;
        z-index: 10;

        .v-carousel__controls {
          background: white;
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
          margin: auto;

          .reviewerInfo {
            font-size: px;
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
