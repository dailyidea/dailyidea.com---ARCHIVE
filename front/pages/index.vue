<template>
  <Layout>
    <div id="newhomePage">
      <!-- desktop view -->

      <section class="firstSection hidden-sm-and-down">
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
              <div class="signUpBtn">
                <v-btn
                  color="primary"
                  :to="{ name: 'auth-signup' }"
                  large
                  rounded
                  class="signupButton"
                  >Sign up Now</v-btn
                >
              </div>
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

      <section class="ideaSection hidden-sm-and-down">
        <div class="ideaSectionHeader">
          Your Idea’s
        </div>

        <v-layout class="desktopReviews">
          <v-flex md4 lg4>
            <div color="white" class="review">
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s, when an unknown printer took a galley of
              type and scrambled.

              <!-- User Icon -->
              <div class="reviewerInfo">
                <div class="row reviewerDetail">
                  <div class="col-md-2">
                    <img
                      alt="image"
                      class="reviewInfoImage"
                      src="~/assets/images/Oval.png"
                    />
                  </div>
                  <div class="col-md-8">
                    <div class="reviewerName">Boniface Esanji</div>
                    <div class="reviewTime">1h ago</div>
                  </div>
                </div>
              </div>
            </div>
          </v-flex>
          <v-flex md4 lg4>
            <div color="white" class="review">
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s, when an unknown printer took a galley of
              type and scrambled.

              <!-- User Icon -->
              <div class="reviewerInfo">
                <div class="row reviewerDetail">
                  <div class="col-md-2">
                    <img
                      alt="image"
                      class="reviewInfoImage"
                      src="~/assets/images/Oval.png"
                    />
                  </div>
                  <div class="col-md-8">
                    <div class="reviewerName">Amelia Cabal</div>
                    <div class="reviewTime">1h ago</div>
                  </div>
                </div>
              </div>
            </div>
          </v-flex>
          <v-flex md4 lg4>
            <div color="white" class="review">
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s, when an unknown printer took a galley of
              type and scrambled.
              <!-- User Icon -->

              <div class="reviewerInfo">
                <div class="row reviewerDetail">
                  <div class="col-md-2">
                    <img
                      alt="image"
                      class="reviewInfoImage"
                      src="~/assets/images/Oval.png"
                    />
                  </div>
                  <div class="col-md-8">
                    <div class="reviewerName">Anne-Marije Markink</div>
                    <div class="reviewTime">1h ago</div>
                  </div>
                </div>
              </div>

              <!-- <div class="gjhkF">
                <div class="reviewTime"> 1h ago</div>
              </div> -->
            </div>
          </v-flex>
        </v-layout>

        <!-- Signup Button -->
        <div class="moreBrowseBtn">
          <v-btn color="primary" large rounded class="browseButton"
            >Browse More Ideas</v-btn
          >
        </div>
      </section>

      <section class="lastSection hidden-sm-and-down ">
        <div class="row futureListContainer">
          <div class="col-md-6">
            <div class="buttomImageContainer">
              <img
                alt="image"
                class="buttomLeftImage"
                src="~/assets/images/newLastImage.png"
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

              <!-- View More Button -->
              <v-btn
                normal
                outlined
                rounded
                class="viewMoreButton"
                color="primary"
                >View More</v-btn
              >
            </div>
          </div>
        </div>
      </section>

      <footer class="footerSection hidden-sm-and-down  ">
        <div class="linkContainer">
          <a>About us</a>
          <a>FAQ</a>
          <a>Terms % Conditions</a>
          <a>Privacy</a>
          <span class="copyRight"> Copyright @DailyIdea 2019</span>
        </div>
      </footer>

      <!-- Mobile view -->

      <section class="mobileFirstSection   hidden-md-and-up">
        <div class="firstFreatureList">
          <div class="firstHeader">Your Idea Could Be Huge!</div>
          <div class="subHeader">That is, if you don't forget it !</div>

          <div class="firstImageContainer">
            <img
              alt="image"
              class="firstImage"
              src="~/assets/images/mobileTopImage.png"
            />
          </div>
          <div class="descriptionSection">
            Submitting an idea every day is as simple as <br />sending an email.
            We will store your ideas for<br />
            you, so you can share them with your friends<br />
            and conquer the world!
          </div>

          <!-- Signup Button -->
          <div class="actionBtn">
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
      </section>

      <section class="mobileIdeaSection hidden-md-and-up">
        <div class="ideaSectionHeader">
          Your Idea’s
        </div>

        <div class="firstIdea">
          <div color="white" sh class="review">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled.

            <!-- User Icon -->

            <div class="reviewerInfo">
              <div class="row reviewerDetail">
                <div class="col-md-0">
                  <img
                    alt="image"
                    class="reviewInfoImage"
                    src="~/assets/images/Oval.png"
                  />
                </div>
                <div class="col-md-0">
                  <div class="reviewerName">Boniface Esanji</div>
                  <div class="reviewTime">1h ago</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="firstIdea">
          <div color="white" class="review">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled.
            <!-- User Icon -->
            <div class="reviewerInfo">
              <div class="row reviewerDetail">
                <div class="col-md-0">
                  <img
                    alt="image"
                    class="reviewInfoImage"
                    src="~/assets/images/Oval.png"
                  />
                </div>
                <div class="col-md-0">
                  <div class="reviewerName">Wilhelm Dowall</div>
                  <div class="reviewTime">1h Ago</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="mobilelasttSection   hidden-md-and-up">
        <div class="firstFreatureList">
          <div class="firstHeader">How it work’s?</div>
          <div class="subHeader">Oh, its easy!</div>

          <div class="lastImageContainer">
            <img
              alt="image"
              class="lastImage"
              src="~/assets/images/newLastImage.png"
            />
          </div>
          <div class="descriptionSection">
            We’ll send you an email every day with a <br />
            reminder for you to submit an idea.<br />
            Just hit reply, and you’ll never forget an<br />
            idea ever again.
          </div>

          <!-- Signup Button -->
          <div class="viewMoreBtn">
            <v-btn
              normal
              outlined
              rounded
              class="viewMoreButton"
              color="primary"
              >View More</v-btn
            >
          </div>
        </div>
      </section>

      <footer class="mobileFooterSection  hidden-md-and-up">
        <div class="linkContainer">
          <a>About us</a>
          <a>FAQ</a>
          <a>Terms % Conditions</a>
          <a>Privacy</a>
        </div>

        <div class="copyRight">
          Copyright @DailyIdea 2019
        </div>
      </footer>
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
        padding-top: 10vh;
        margin-top: 10vh;
        margin-left: 8vh;
        text-align: left;

        .firstHeader {
          font-family: Avenir;
          font-size: 40px;
          font-weight: 400;
          line-height: 1.2;
          color: #4a4a4a;
          font-weight: bolder;
        }

        .subHeader {
          font-family: Avenir;
          margin-top: 3vh;
          font-size: 22px;
          color: #4a4a4a;
          line-height: 1.5;
        }

        .descriptionSection {
          margin-top: 10vh;
          font-family: Avenir;
          font-size: 18px;
          color: #4a4a4a;
        }

        .signUpBtn {
          .signupButton {
            margin-top: 30px;
            width: 200px;
            background: #326bde !important;

            -webkit-box-shadow: 4px 26px 79px -11px rgba(50, 107, 222, 1);
            -moz-box-shadow: 4px 26px 79px -11px rgba(50, 107, 222, 1);
            box-shadow: 4px 26px 79px -11px rgba(50, 107, 222, 1);
          }
        }
      }

      .firstImageContainer {
        margin-right: 10vh;
        margin-top: 20px;

        .firstImage {
          height: 60vh;
        }
      }
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
      font-family: Avenir;
      font-size: 19px;
      font-weight: 600;
      font-style: normal;
      font-stretch: normal;
      line-height: normal;
      letter-spacing: normal;
      color: #4a4a4a;
    }

    .desktopReviews {
      margin-left: 30vh;
      margin-right: 30vh;

      .review {
        font-family: Avenir;
        max-width: 320px !important;
        width: 350px;
        padding: 18px 25px;
        font-size: 16px;
        margin: auto;
        font-size: 14px;
        border-radius: 4px;
        background-color: #ffffff;
        border: solid 1px #d8e3f9;
        padding-bottom: 0px;

        .reviewerInfo {
          border-top: 0.8px solid #e8e8e8;
          font-size: 12px;
          font-family: Avenir;
          color: #777;
          margin-top: 15px;
          padding-top: 5px;
          margin-right: 6vh;

          .reviewerDetail {
            .reviewInfoImage {
              height: 37px;
            }

            .reviewerName {
              margin-left: 10px;
              height: 16px;
              font-family: Avenir;
              font-size: 12px;
              font-weight: 900;
              font-stretch: normal;
              font-style: normal;
              line-height: normal;
              letter-spacing: normal;
              color: #4a4a4a;
            }

            .reviewTime {
              margin-left: 10px;
              margin-top: 3px;
            }
          }

          .gjhkF {
            display: inline-block;
          }
        }
      }
    }

    .moreBrowseBtn {
      margin-top: 10vh;
      text-align: center;
      .browseButton {
        width: 200px;
        background: #326bde !important;

        -webkit-box-shadow: 4px 26px 79px -11px rgba(50, 107, 222, 1);
        -moz-box-shadow: 4px 26px 79px -11px rgba(50, 107, 222, 1);
        box-shadow: 4px 26px 79px -11px rgba(50, 107, 222, 1);
      }
    }
  }

  .lastSection {
    margin-left: 10vh;
    margin-top: 15vh;
    background-size: cover;
    background-repeat: no-repeat;
    padding: 0px !important;

    .futureListContainer {
      .buttomImageContainer {
        padding-bottom: 7vh;
        text-align: center;
        margin: auto;
        .buttomLeftImage {
          height: 60vh;
          margin: auto;
        }
      }

      .firstFreatureList {
        margin-top: 15vh;
        margin-left: 10vh;
        text-align: left;

        .firstHeader {
          font-family: Avenir;
          font-size: 25px;
          font-weight: 500;
          font-style: normal;
          font-stretch: normal;
          line-height: normal;
          letter-spacing: normal;
          color: #4a4a4a;
        }

        .subHeader {
          font-family: Avenir;
          margin-top: 3vh;
          font-size: 40px;
          color: #4a4a4a;
          line-height: normal;
          font-stretch: normal;
          font-weight: 900;
        }

        .descriptionSection {
          font-family: Avenir;
          margin-top: 7vh;
          font-size: 18px;
          line-height: 2;
          color: #4a4a4a;
          font-weight: normal;
          font-stretch: normal;
          letter-spacing: normal;
          color: #4a4a4a;
        }

        .viewMoreButton {
          width: 200px;
          margin-top: 30px;
        }
      }
    }
  }

  .footerSection {
    padding-top: 30px;
    padding-bottom: 30px;
    padding-right: 20px;
    padding-left: 20px;
    .linkContainer {
      border-top: 0.2px solid #e8e8e8;
      padding-top: 20px;
      // text-align: center;
      a {
        font-family: Avenir;
        height: 56px;
        font-size: 16px;
        margin-left: 20px;
        margin-right: 20px;
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        line-height: 2.33;
        letter-spacing: normal;
        color: #4a4a4a;
      }

      .copyRight {
        font-family: Avenir;
        float: right;
        height: 28px;
        font-size: 16px;
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        line-height: 2.8;
        letter-spacing: normal;
        color: #4a4a4a;
      }
    }
  }

  .mobileFirstSection {
    padding-top: 20px;
    .firstFreatureList {
      .firstHeader {
        font-family: Avenir;
        margin-right: 20px;
        font-size: 26px;
        font-weight: 900;
        font-stretch: normal;
        font-style: normal;
        line-height: normal;
        letter-spacing: normal;
        color: #4a4a4a;
        text-align: center;
      }

      .subHeader {
        font-family: Avenir;
        font-size: 18px;
        text-align: left;
        margin-left: 3vh;
        margin-top: 10px;
      }

      .firstImageContainer {
        margin-top: 20px;
        padding: 20px 20px 20px 20px;
        .firstImage {
          height: 26vh;
        }
      }

      .descriptionSection {
        font-family: Avenir;
        margin-top: 2vh;
        font-size: 15px;
        padding-left: 20px;
        padding-right: 20px;
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        line-height: 2;
        letter-spacing: normal;
        color: #4a4a4a;
      }

      .actionBtn {
        padding-top: 25px;
        padding-bottom: 30px;
        text-align: center;
        .signupButton {
          width: 177px;
          background: #326bde !important;

          -webkit-box-shadow: 4px 26px 79px -11px rgba(50, 107, 222, 1);
          -moz-box-shadow: 4px 26px 79px -11px rgba(50, 107, 222, 1);
          box-shadow: 4px 26px 79px -11px rgba(50, 107, 222, 1);
        }
      }
    }
  }

  .mobileIdeaSection {
    padding-top: 20px;
    padding-bottom: 20px;

    .ideaSectionHeader {
      font-family: Avenir;
      text-align: center;
      font-size: 19px;
      margin-bottom: 20px;
      font-weight: 600;
      color: #4a4a4a;
      font-stretch: normal;
      font-style: normal;
      line-height: normal;
      letter-spacing: normal;
    }

    .firstIdea {
      margin-top: 35px;
      padding-left: 22px;
      padding-right: 22px;

      .review {
        font-family: Avenir;
        font-size: 13px;
        padding: 18px 10px 10px 10px;
        width: 100%;
        border-radius: 3.2px;
        border: solid 0.8px #d8e3f9;

        .reviewerInfo {
          border-top: 0.8px solid #e8e8e8;
          margin-top: 10px;
          padding-top: 20px;
          margin-right: 7vh;

          .reviewerDetail {
            // margin-left: 10px;
            .reviewInfoImage {
              margin-left: 12px;
              width: 38px;
            }

            .reviewerName {
              margin-left: 15px;
              height: 14px;
              font-family: Avenir;
              font-weight: 1000;
              font-stretch: normal;
              font-style: normal;
              // line-height: normal;
              letter-spacing: normal;
              color: #4a4a4a;
            }

            .reviewTime {
              margin-top: 5px;
              margin-left: 15px;
            }
          }
        }
      }
    }
  }

  .mobilelasttSection {
    padding: 50px 10px 30px 10px;

    .firstFreatureList {
      .firstHeader {
        font-family: Avenir;
        margin-left: 15px;
        font-size: 20px;
        font-weight: 500;
        font-stretch: normal;
        font-style: normal;
        line-height: normal;
        letter-spacing: normal;
        color: #4a4a4a;
      }

      .subHeader {
        font-family: Avenir;
        height: 40px;
        margin-top: 15px;
        margin-left: 15px;
        font-size: 30px;
        font-weight: 900;
        font-stretch: normal;
        font-style: normal;
        line-height: normal;
        letter-spacing: normal;
        color: #4a4a4a;
      }

      .lastImageContainer {
        text-align: center;
        padding-top: 25px;
        padding-bottom: 10px;
        margin-top: 20px;
        .lastImage {
          width: 100%;
        }
      }

      .descriptionSection {
        font-family: Avenir;
        padding: 2vh;
        height: 112px;
        font-size: 15px;
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        line-height: 2;
        letter-spacing: normal;
        color: #4a4a4a;
      }

      .viewMoreBtn {
        padding-top: 2vh;
        margin-top: 30px;
        text-align: center;
        .viewMoreButton {
          width: 177px;
          color: #979797 !important;
        }
      }
    }
  }

  .mobileFooterSection {
    padding-top: 20px;
    padding-bottom: 3px;
    padding-right: 10px;
    padding-left: 10px;
    .linkContainer {
      border-top: 0.2px solid #e8e8e8;
      padding-top: 20px;
      text-align: center;
      a {
        font-family: Avenir;
        height: 56px;
        font-size: 12px;
        margin-left: 10px;
        margin-right: 10px;
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        line-height: 2.33;
        letter-spacing: normal;
        color: #4a4a4a;
      }
    }

    .copyRight {
      font-family: Avenir;
      margin-bottom: 10px;
      text-align: center;
      height: 28px;
      font-size: 12px;
      font-weight: normal;
      font-stretch: normal;
      font-style: normal;
      line-height: 2.8;
      letter-spacing: normal;
      text-align: center;
      color: #4a4a4a;
    }
  }
}
</style>
