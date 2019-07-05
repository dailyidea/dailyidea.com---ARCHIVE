<template>
  <div id="homePage">
    <!-- First Section -->
    <div class="firstSection">
      <!-- Desktop - Hero Message & Signup Button -->

      <v-layout class="desktopHero" fluid grid-list-md hidden-sm-and-down row>
        <v-flex hidden-sm-and-down md7 lg6>
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
          <v-btn large class="signupButton" color="primary">Sign up Now</v-btn>
        </v-flex>

        <!-- Mobile Only Hero -->
        <v-flex hidden-md-and-up md6 lg5 offset-md1 offset-lg2>
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
          <v-btn large class="signupButton" color="primary">Sign up Now</v-btn>
        </v-flex>
      </v-layout>

      <!-- Mobile - Hero Message & Signup Button -->
      <v-layout class="mobileHero" hidden-md-and-up>
        <div class="heroTitle">
          Your Idea
          <br />Could Be Huge!
        </div>
        <div class="heroSubtitle">That is, if you don't forget it!</div>
        <div class="heroDescription">
          Submitting an idea every day is as simple as sending an email. We will
          store your ideas for you, so you can share them with your friends and
          conquer the world!
        </div>
        <!-- Signup Button -->
        <v-btn medium class="signupButton" color="primary">Sign up Now</v-btn>
      </v-layout>

      <!-- Desktop Reviews -->
      <v-layout
        hidden-sm-and-down
        fluid
        grid-list-md
        xs12
        class="desktopReviews"
        row
      >
        <v-flex md4 lg4>
          <v-card color="white" class="review">
            Excepteur sint occaecat cuidatat non proident, sunt in culpa qui
            officia deserunt

            <!-- User Icon -->
            <div class="reviewerInfo">
              <v-icon class="userIcon">fa-user-circle</v-icon>
              by Name Surname
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
              <v-icon class="userIcon">fa-user-circle</v-icon>
              by Name Surname
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
              <v-icon class="userIcon">fa-user-circle</v-icon>
              by Name Surname
              <div class="reviewTime">1h ago</div>
            </div>
          </v-card>
        </v-flex>
      </v-layout>

      <!-- Mobile Reviews -->
      <v-layout hidden-md-and-up>
        <v-carousel
          interval="600000"
          hide-controls
          delimiter-icon="fa-circle"
          class="mobileReviewCrousel"
        >
          <v-carousel-item class="review">
            Excepteur sint occaecat cuidatat non proident, sunt in culpa qui
            officia deserunt

            <!-- User Icon -->
            <div class="reviewerInfo">
              <v-icon class="userIcon">fa-user-circle</v-icon>
              by Name Surname
              <div class="reviewTime">1h ago</div>
            </div>
          </v-carousel-item>
          <v-carousel-item class="review">
            Excepteur sint occaecat cuidatat non proident, sunt in culpa qui
            officia deserunt

            <!-- User Icon -->
            <div class="reviewerInfo">
              <v-icon class="userIcon">fa-user-circle</v-icon>
              by Name Surname
              <div class="reviewTime">1h ago</div>
            </div>
          </v-carousel-item>
          <v-carousel-item class="review">
            Excepteur sint occaecat cuidatat non proident, sunt in culpa qui
            officia deserunt

            <!-- User Icon -->
            <div class="reviewerInfo">
              <v-icon class="userIcon">fa-user-circle</v-icon>
              by Name Surname
              <div class="reviewTime">1h ago</div>
            </div>
          </v-carousel-item>
          <v-carousel-item class="review">
            Excepteur sint occaecat cuidatat non proident, sunt in culpa qui
            officia deserunt

            <!-- User Icon -->
            <div class="reviewerInfo">
              <v-icon class="userIcon">fa-user-circle</v-icon>
              by Name Surname
              <div class="reviewTime">1h ago</div>
            </div>
          </v-carousel-item>
        </v-carousel>
      </v-layout>
    </div>

    <!-- Second Section -->
    <div class="secondSection">
      <!-- Desktop View -->
      <v-container class="desktopView" hidden-sm-and-down>
        <v-layout row wrap>
          <!-- Left side image -->
          <v-flex xs7>
            &nbsp;
          </v-flex>
          <!-- Right side description -->
          <v-flex xs5 md5>
            <div class="ttle">How it works</div>
            <div class="subTitle">Oh, it's easy!</div>
            <div class="description">
              We'll send you an email every day with a reminder for you to
              submit an idea. Just hit reply, and you'll never again.
            </div>
            <v-btn class="buttn" outline>More</v-btn>
          </v-flex>
        </v-layout>
      </v-container>

      <!-- Mobile View -->
      <v-container class="mobileView" grid-list-md hidden-md-and-up>
        <div class="ttle">How it works</div>
        <div class="subTitle">Oh, it's easy!</div>
        <div class="description">
          We'll send you an email every day with a reminder for you to submit an
          idea. Just hit reply, and you'll never again.
        </div>
        <v-btn class="buttn" outline>More</v-btn>
      </v-container>
    </div>

    <!-- Footer -->
    <div class="homeFooter">
      <v-layout row wrap>
        <v-flex md10 lg10 hidden-sm-and-down> &nbsp;</v-flex>
        <v-flex md2 lg2>
          <i class="fab fa-instagram"></i>
          <i class="fab fa-twitter"></i>
          <i class="fab fa-facebook-f"></i>
        </v-flex>
      </v-layout>
    </div>
  </div>
</template>

<script>
export default {
  fetch({ store, redirect }) {
    if (store.getters['cognito/isLoggedIn']) {
      redirect({ name: 'ideas' })
    }
  },
  methods: {
    logout() {
      this.$store.dispatch('cognito/signOut')
    },

    login() {
      return true
    }
  }
}
</script>

<style lang="scss">
#homePage {
  .firstSection {
    width: 100%;
    min-height: 100vh;
    text-align: left;
    background: #ffc61e;
    padding-bottom: 8vh;

    .desktopHero {
      padding-left: 11.5%;
      .heroTitle {
        font-size: 4vw;
        line-height: 4.5vw;
        padding-top: 7vh;
        font-weight: bold;
      }

      .heroSubtitle {
        font-size: 1.6vw;
        color: black;
        font-weight: bold;
        margin-top: 3vh;
        padding-left: 5px;
      }

      .heroDescription {
        padding-left: 5px;
        color: white;
        font-size: 1.2vw;
        padding-top: 2vh;
        width: 60%;
        text-align: left;
        letter-spacing: 1px;
        // font-weight: lighter;
      }

      .signupButton {
        width: 220px;
        font-size: 13px;
        margin-top: 7vh;
      }
    }

    .mobileHero {
      display: block;
      width: 85%;
      margin: auto;
      .heroTitle {
        font-size: 40px;
        width: 70%;
        line-height: 40px;
        letter-spacing: 1px;
        padding-top: 7vh;
        font-weight: bold;
        display: block;
      }

      .heroSubtitle {
        font-size: 14px;
        color: black;
        font-weight: bold;
        margin-top: 20px;
        padding-left: 5px;
      }

      .heroDescription {
        padding-left: 5px;
        color: white;
        font-size: 14px;
        padding-top: 16px;
        width: 54%;
        text-align: left;
        letter-spacing: 1px;
        // font-weight: lighter;
      }

      .signupButton {
        width: 120px;
        font-size: 13px;
        margin-top: 40px;
      }
    }

    .desktopReviews {
      padding-left: 10px;
      width: 80%;
      margin: auto;
      margin-top: 7vh;

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

    .mobileReviewCrousel {
      // border: 1px solid red;
      width: 90%;
      margin: auto;
      max-height: 33vh;
      background: white;
      margin-top: 25px;
      padding-bottom: 10px;

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
        padding: 25px 23px;
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

  .secondSection {
    text-align: left;
    padding-top: 5vh;

    .desktopView {
      .ttle {
        color: #ffc61e;
        font-style: italic;
        font-size: 2vw;
        line-height: 2.3vw;
      }

      .subTitle {
        font-size: 3vw;
      }

      .description {
        width: 80%;
        padding-top: 3vh;
        font-size: 1.2vw;
        line-height: 2.2vw;
        letter-spacing: 1px;
        padding-left: 5px;
      }
    }

    .desktopView {
      .ttle {
        color: #ffc61e;
        font-style: italic;
        font-size: 2vw;
        line-height: 2.3vw;
      }

      .subTitle {
        font-size: 4vw;
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

    .mobileView {
      padding-left: 8%;

      .ttle {
        color: #ffc61e;
        font-style: italic;
        font-size: 4vw;
        line-height: 4vw;
      }

      .subTitle {
        font-size: 9vw;
      }
      .description {
        width: 70%;
        padding-top: 3vh;
        font-size: 4vw;
        padding-left: 5px;
        color: #aca7ae;
      }

      .buttn {
        margin-top: 30vh;
      }
    }

    .buttn {
      color: #3a1852 !important;
      border: 2px solid #cbc4cf !important;
    }
  }

  .homeFooter {
    background: #35124e;
    color: white;
    padding: 20px;
    i {
      margin-left: 13px;
      margin-right: 13px;
    }
  }
}
</style>
