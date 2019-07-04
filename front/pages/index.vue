<template>
  <div id="homePage">
    <div id="firstSection">
      <!-- Desktop - Hero Message & Signup Button -->
      <v-layout class="desktopHero" hidden-sm-and-down row>
        <!-- Desktop Hero -->
        <v-flex hidden-sm-and-down xs12 md6 lg5 offset-md1 offset-lg2>
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
      <v-layout hidden-sm-and-down xs12 class="desktopReviews" row>
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
  #firstSection {
    width: 100%;
    min-height: 100vh;
    text-align: left;
    background: #ffc61e;

    .desktopHero {
      .heroTitle {
        font-size: 70px;
        line-height: 85px;
        letter-spacing: 1px;
        padding-top: 7vh;
        font-weight: bold;
      }

      .heroSubtitle {
        font-size: 30px;
        color: black;
        font-weight: bold;
        margin-top: 20px;
        padding-left: 5px;
      }

      .heroDescription {
        padding-left: 5px;
        color: white;
        font-size: 20px;
        padding-top: 16px;
        width: 52%;
        text-align: left;
        letter-spacing: 1px;
        font-weight: lighter;
      }

      .signupButton {
        width: 220px;
        font-size: 13px;
        margin-top: 40px;
      }
    }

    .mobileHero {
      display: block;
      width: 85%;
      margin: auto;
      .heroTitle {
        font-size: 50px;
        width: 70%;
        line-height: 55px;
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
        font-size: 13px;
        padding-top: 16px;
        width: 54%;
        text-align: left;
        letter-spacing: 1px;
        font-weight: lighter;
      }

      .signupButton {
        width: 120px;
        font-size: 13px;
        margin-top: 40px;
      }
    }

    .desktopReviews {
      padding-left: 10px;
      width: 70%;
      margin: auto;
      margin-top: 7vh;

      .review {
        max-width: 400px !important;
        padding: 40px 33px;
        font-size: 20px;
        margin: auto;

        .reviewerInfo {
          font-size: 14px;
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
      max-height: 27vh;
      background: white;
      margin-top: 20px;
      margin-bottom: 30px;
      .v-carousel__controls {
        background: white;

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
        font-size: 16px;
        margin: auto;

        .reviewerInfo {
          font-size: 14px;
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
</style>
