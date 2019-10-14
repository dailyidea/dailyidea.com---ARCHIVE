<template>
  <Layout>
    <div id="newhomePage">
      <!-- desktop view -->

      <section class="firstSection " fluid grid-list-md hidden-sm-and-down row>
        <div class="row futureListContainer">
          <div class="col-md-5">
            <div class="firstFreatureList">
              <div class="firstHeader">Your Idea Could Be Huge!</div>
              <div class="subHeader">That is, if you don't forget it !</div>
              <div class="descriptionSection">
                Submitting an idea every day is as simple as sending an
                email.<br />
                We will store your ideas for you, so you can share them with
                your<br />
                friends and conquer the world!
              </div>

              <!-- Signup Button -->
              <v-btn
                normal
                dark
                rounded
                class="signupButton"
                :to="{ name: 'auth-signup' }"
                color="#326bde"
                >Sign up Now</v-btn
              >
            </div>
          </div>

          <div class="col-md-7">
            <div class="firstImageContainer">
              <img
                alt="image"
                class="firstImage"
                src="~/assets/images/homeImage.png"
              />
            </div>
          </div>
        </div>
      </section>

      <section class="ideaSection">
        <div class="ideaSectionHeader">
          Your Idea’s
        </div>

        <v-layout class="desktopReviews">
          <v-flex md4 lg4>
            <v-card color="white" class="review">
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s, when an unknown printer took a galley of
              type and scrambled.

              <!-- User Icon -->
              <div class="reviewerInfo">
                <v-icon class="userIcon">fa-user-circle</v-icon>by Name Surname
                <div class="reviewTime">1h ago</div>
              </div>
            </v-card>
          </v-flex>
          <v-flex md4 lg4>
            <v-card color="white" class="review">
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s, when an unknown printer took a galley of
              type and scrambled.
              <!-- User Icon -->
              <div class="reviewerInfo">
                <v-icon class="userIcon">fa-user-circle</v-icon>by Name Surname
                <div class="reviewTime">1h ago</div>
              </div>
            </v-card>
          </v-flex>
          <v-flex md4 lg4>
            <v-card color="white" class="review">
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s, when an unknown printer took a galley of
              type and scrambled.
              <!-- User Icon -->
              <div class="reviewerInfo">
                <v-icon class="userIcon">fa-user-circle</v-icon>by Name Surname
                <div class="reviewTime">1h ago</div>
              </div>
            </v-card>
          </v-flex>
        </v-layout>

        <!-- Signup Button -->
        <div class="moreBrowseBtn">
          <v-btn large rounded color="primary" class="browseButton"
            >Browse More Ideas</v-btn
          >
        </div>
      </section>

      <section class="lastSection ">
        <div class="row futureListContainer">
          <div class="col-md-6">
            <div class="buttomImageContainer">
              <img
                alt="image"
                class="buttomLeftImage"
                src="~/assets/images/buttomLeft.png"
              />
            </div>
          </div>

          <div class="col-md-6">
            <div class="firstFreatureList">
              <div class="firstHeader">How it work’s?</div>
              <div class="subHeader">Oh, its easy!</div>

              <div class="descriptionSection">
                We’ll send you an email every day with a reminder for<br />
                you to submit an idea. Just hit reply, and you’ll never<br />
                forget an idea ever again.
              </div>

              <!-- Signup Button -->
              <v-btn
                normal
                outlined
                rounded
                class="signupButton"
                color="primary"
                >View More</v-btn
              >
            </div>
          </div>
        </div>
      </section>

      <!-- <section class="footerSection">

        <div class="ddc">
          About us
        </div>
        <div class="ddc">
          FAQ
        </div>
        <div class="ddc">
          Tems & Condition
        </div>
        <div class="ddc">
          Privacy
        </div>

        <div class="dwscvh">
          Copyright @DailyIdea 2019
        </div>
      </section> -->

      <v-footer class="footer">
        <div class="footer1">
          <h2>About us</h2>
        </div>
        <div class="footer2">
          <h2>FAQ</h2>
        </div>
        <div class="footer2">
          <h2>Tems & Condition</h2>
        </div>
        <div class="footer2">
          <h2>Privacy</h2>
        </div>

        <div class="dwscvh">
          <h2>Copyright @DailyIdea 2019</h2>
        </div>
      </v-footer>
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
#newhomePage {
  background: white;

  @media #{$small-screen} {
    width: 100%;
  }

  .firstSection {
    margin-left: 10vh;
    background-size: cover;
    background-repeat: no-repeat;
    padding: 0px !important;

    .futureListContainer {
      padding-top: 4vh;
      .firstFreatureList {
        // display: none;
        padding-top: 10vh;
        margin-top: 10vh;
        margin-left: 8vh;
        text-align: left;

        .firstHeader {
          font-size: 30px;
          font-weight: 400;
          line-height: 1.2;
          color: #4a4a4a;
          font-weight: bolder;
        }

        .subHeader {
          margin-top: 3vh;
          font-size: 18px;
          color: #4a4a4a;

          line-height: 1.5;
        }

        .descriptionSection {
          margin-top: 10vh;
          font-size: 15px;
          // line-height: 1.5;
          color: #4a4a4a;
        }

        .signupButton {
          margin-top: 25px;
        }
      }

      .firstImageContainer {
        // display: none;
        margin-right: 10vh;
        margin-top: 20px;

        .firstImage {
          // display: none;
          // border: 1px solid red;
          height: 60vh;
          // padding-right: 10vh;
          // width: 100%;
          // border-radius: 6px;
        }
      }
    }

    @media #{$small-screen} {
      padding-top: 0px;
    }
  }

  .ideaSection {
    margin-top: 10vh;
    margin-bottom: 40px;

    .ideaSectionHeader {
      margin-top: 20px;
      margin-bottom: 40px;
      text-align: center;
      height: 26px;
      // font-family: Avenir;
      font-size: 19px;
      font-weight: 600;
      font-style: normal;
      font-stretch: normal;
      line-height: normal;
      letter-spacing: normal;
      color: #4a4a4a;
    }

    .desktopReviews {
      margin-left: 25vh;
      margin-right: 25vh;
      .review {
        max-width: 320px !important;
        height: 230px;
        width: 100%;
        padding: 18px 25px;
        font-size: 16px;
        margin: auto;
        font-size: 14px;
        border-radius: 4px;
        border: solid 1px #326bde;
        background-color: #ffffff;

        .reviewerInfo {
          font-size: 10px;
          color: #777;
          line-height: 30px;
          margin-top: 30px;

          .userIcon {
            color: #35124e;
            font-size: 25px;
            // line-height: 20px;
            margin-right: 10px;
          }

          .reviewTime {
            // float: right;
            margin-left: 35px;
          }
        }
      }
    }

    .moreBrowseBtn {
      margin-top: 10vh;
      text-align: center;

      color: blue !important;
    }
  }

  .lastSection {
    margin-left: 10vh;
    margin-top: 15vh;
    background-size: cover;
    background-repeat: no-repeat;
    padding: 0px !important;

    .futureListContainer {
      // padding-top: 7vh;

      .buttomImageContainer {
        // display: none;
        // margin-right: 30px;
        // margin-top: 20px;
        // border: 1px solid red;
        text-align: center;
        margin: auto;
        .buttomLeftImage {
          // display: none;
          height: 70vh;
          margin: auto;
          // border: 1px solid red;
        }
      }

      .firstFreatureList {
        // display: none;
        margin-top: 15vh;
        margin-left: 10vh;
        text-align: left;

        .firstHeader {
          // width: 128px;
          // height: 26px;
          // font-family: Avenir;
          font-size: 19px;
          font-weight: 500;
          font-style: normal;
          font-stretch: normal;
          line-height: normal;
          letter-spacing: normal;
          color: #4a4a4a;
        }

        .subHeader {
          margin-top: 3vh;
          font-size: 30px;
          color: #4a4a4a;
          line-height: normal;
          font-stretch: normal;
          font-weight: 900;
        }

        .descriptionSection {
          margin-top: 7vh;
          font-size: 14px;
          line-height: 2;
          color: #4a4a4a;
          font-weight: normal;
          font-stretch: normal;
          letter-spacing: normal;
          color: #4a4a4a;
        }

        .signupButton {
          width: 177px;
          margin-top: 30px;
        }
      }
    }
  }

  // .footerSection {
  //   margin-top: 5vh;
  //   margin-bottom: 5vh;
  //   position: relative;
  //   border-top: 1px solid #4a4a4a;

  //   .ddc {
  //     padding-top: 20px !important;
  //     display: inline;
  //   }
  //   // .sdfxf {
  //   //   padding-top: 10px !important;
  //   //   display: inline;
  //   // }
  //   // .sdvx {
  //   //   display: inline;
  //   // }
  //   // .ddsxcc {
  //   //   display: inline;
  //   // }

  //   .dwscvh {
  //     float: right;
  //   }
  // }

  .footer {
    // align-items: baseline;
    margin-top: 10vh;
    height: 22vh;
    background: white;

    .footer1 {
      font-size: 10px;
      padding-left: 5vh;
      display: inline-block;
    }
    .footer2 {
      font-size: 10px;
      padding-left: 5vh;
      display: inline-block;
    }
    .dwscvh {
      float: right;
      font-size: 10px;
      // display: inline-block;
    }
  }
}
</style>
