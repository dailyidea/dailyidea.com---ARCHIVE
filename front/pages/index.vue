<template>
  <Layout>
    <div id="newhomePage">
      <!-- Hero Section -->
      <v-row class="section heroSection" no-gutters>
        <!-- Hero left side -->
        <v-col sm="12" md="6" class="heroMessageContainer">
          <div class="heroTitle">Every Day, Log An Idea</div>
          <div class="heroSubTitle">
            A project idea, a startup idea, a work idea
          </div>

          <!-- Mobile only => Hero Images -->
          <div class="col-md-6 heroImageContainer  hidden-md-and-up">
            <img class="lampImg" src="~/assets/images/yellowBulb.png" />
            <img
              class="personImg person2Img"
              src="~/assets/images/home/person_2.png"
            />
            <img
              class="personImg person3Img"
              src="~/assets/images/home/person_3.png"
            />
          </div>

          <div class="heroDescription">
            You'll get an email in your inbox reminding you to submit an idea.
            Just respond to it and we'll save it for you.
          </div>

          <!-- Signup Button -->
          <v-btn
            color="primary"
            :to="{ name: 'auth-signup' }"
            large
            rounded
            dark
            class="signupButton"
            >Sign up Now</v-btn
          >
        </v-col>

        <!-- Desktop only - Hero right side -->
        <v-col sm="12" md="6" class="heroImageContainer hidden-sm-and-down">
          <img class="lampImg" src="~/assets/images/yellowBulb.png" />
          <img
            class="personImg person2Img"
            src="~/assets/images/home/person_2.png"
          />
          <img
            class="personImg person3Img"
            src="~/assets/images/home/person_3.png"
          />
        </v-col>
      </v-row>

      <!-- Idea List Section -->
      <section class="section ideaListSection">
        <!-- Header -->
        <div class="header">
          Your Idea’s
        </div>

        <!-- Idea list -->
        <div class="row ideaListContainer">
          <div v-for="idea in ideas" :key="idea.ideaId" class="col-md-4">
            <div class="ideaCard">
              <div class="ideaContent" v-html="idea.content"></div>

              <div class="divider"></div>

              <!-- User Icon -->
              <div class="ideaOwnerInfo">
                <div class="ideaOwnerImage">
                  <img alt="image" class="" src="~/assets/images/Oval.png" />
                </div>
                <div class="nameCotainer">
                  <div class="name">Boniface Esanji</div>
                  <div class="time">{{ idea.relativeCreatedTime }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Browse More ideas -->
        <div class="moreIdeasContainer">
          <v-btn color="primary" dark large rounded class="browseButton"
            >Browse More Ideas</v-btn
          >
        </div>
      </section>

      <!-- how it works section -->
      <section class="section howItWorksSection">
        <v-row class="sectionContent" no-gutters>
          <!-- left side image - desktop only -->
          <v-col sm="12" md="6" class="leftSide hidden-sm-and-down">
            <img alt="image" src="~/assets/images/home_footer.png" />
          </v-col>

          <v-col sm="12" md="6" class="rightSide">
            <div class="subHeader">How it work’s?</div>
            <div class="header">Oh, its easy!</div>

            <!-- Mobile only section image -->
            <img
              alt="image"
              class="sectionMobileImage hidden-md-and-up"
              src="~/assets/images/home_footer.png"
            />

            <div class="descriptionSection">
              We’ll send you an email every day with a reminder for you to
              submit an idea. Just hit reply, and you’ll never forget an idea
              ever again.
            </div>
          </v-col>
        </v-row>
      </section>

      <!-- Footer Section -->
      <section class="row section footerSection">
        <div class="col-md-9 col-sm-12 linksList">
          <a>About us</a>
          <a>FAQ</a>
          <a>Terms & Conditions</a>
          <a>Privacy</a>
        </div>
        <div class="col-md-3 col-sm-12 copyright">
          Copyright @DailyIdea 2019
        </div>
      </section>
    </div>
  </Layout>
</template>

<script>
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import Layout from '@/components/layout/Layout'
import getPublicIdeas from '~/graphql/query/getPublicIdeas'
dayjs.extend(relativeTime)

export default {
  components: { Layout },
  data: () => ({
    ideas: null
  }),
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
    this.ideas.forEach(idea => {
      idea.relativeCreatedTime = dayjs(idea.createdDate).fromNow()
    })
  },
  methods: {}
}
</script>

<style lang="scss">
#newhomePage {
  background: white;
  font-family: Avenir;
  width: 100%;
  overflow-x: hidden;

  padding-left: 10%;
  padding-right: 10%;
  color: #4a4a4a;

  @media #{$small-screen} {
    padding-left: 7%;
    padding-right: 7%;
  }

  // Common style for all sections
  .section {
  }

  .heroSection {
    margin-top: 7vh;
    .heroMessageContainer {
      padding-top: 13vh;

      .heroTitle {
        font-size: 40px;
        font-weight: 400;
        font-weight: bolder;
      }

      .heroSubTitle {
        margin-top: 3vh;
        font-size: 22px;
        line-height: 1.5;
      }

      .heroDescription {
        margin-top: 10vh;
        font-size: 18px;
      }

      .signupButton {
        margin-top: 7vh;
        width: 200px;
      }
    }

    .heroImageContainer {
      padding-right: 0%;
      margin-top: 0px;
      text-align: right;
      position: relative;

      .personImg {
        height: 60vh;
        margin-top: 15vh;
        margin-right: 0%;
      }

      .lampImg {
        position: absolute;
        height: 22vh;
        left: 10%;
        top: 0%;
      }
    }

    @media #{$small-screen} {
      margin-top: 0vh;

      .heroMessageContainer {
        padding-top: 4vh;
        padding-left: 0px;
        text-align: center;

        .heroTitle {
          font-size: 28px;
          text-align: left;
        }

        .heroSubTitle {
          margin-top: 1vh;
          font-size: 17px;
          text-align: left;
        }

        .heroImageContainer {
          margin-top: 5vh;
          margin-top: 3vh;
          padding-right: 10%;
          text-align: right;
          position: relative;

          .personImg {
            height: 30vh;
            margin-top: 10vh;
            margin-right: 3%;
            // border: 1px solid red;
          }

          .lampImg {
            width: 25%;
            height: auto;
            left: 7%;
            top: 0%;
          }
        }

        .heroDescription {
          margin-top: 0vh;
          font-size: 14px;
          line-height: 2;
          text-align: justify;
        }

        .signupButton {
          margin-top: 30px;
          margin-left: auto;
          margin-right: auto;
          width: 200px;
        }
      }

      .heroImageContainer {
        padding-right: 10vh;
        margin-top: 0px;
        text-align: right;
        position: relative;

        .personImg {
          height: 60vh;
          margin-top: 30vh;
          margin-right: 10%;
          // border: 1px solid red;
        }

        .lampImg {
          position: absolute;
          height: 22vh;
          left: 10%;
          top: 0%;
        }

        .firstImage {
          height: 60vh;
        }
      }
    }
  }

  .ideaListSection {
    margin-top: 7vh;

    .header {
      margin-bottom: 4vh;
      text-align: center;
      font-size: 22px;
      font-weight: 600;
    }

    .ideaListContainer {
      .ideaCard {
        border: solid 2px #e2eafa;
        border-radius: 4px;
        padding: 15px;

        .ideaContent {
          font-size: 14px;
          line-height: 2;
        }

        .divider {
          border-top: 1.5px solid #e2eafa;
          margin-bottom: 15px;
          margin-top: 10px;
        }

        .ideaOwnerInfo {
          display: flex;
          flex-direction: row;
          .ideaOwnerImage {
            flex: 0.2;
            img {
              width: 55px;
            }
          }

          .nameCotainer {
            flex: 0.8;
            padding-left: 15px;
            .name {
              padding-top: 3px;
              font-size: 16px;
              font-weight: 900;
              line-height: 1.5;
            }
            .time {
              font-size: 13px;
            }
          }
        }
      }
    }

    .moreIdeasContainer {
      margin-top: 5vh;
      text-align: center;
    }
  }

  .howItWorksSection {
    margin-top: 20vh;

    .sectionContent {
      .leftSide {
        text-align: center;
        img {
          height: 55vh;
        }
      }
      .rightSide {
        padding-top: 13vh;
        padding-left: 5%;

        .header {
          font-size: 40px;
          font-weight: bold;
        }

        .subHeader {
          font-size: 22px;
        }

        .descriptionSection {
          margin-top: 5vh;
          width: 85%;
          line-height: 2;
          font-size: 16px;
        }
      }
    }

    @media #{$small-screen} {
      margin-top: 0vh;

      .sectionContent {
        .rightSide {
          .sectionMobileImage {
            width: 100%;
            margin-top: 7vh;
          }
          .descriptionSection {
            width: 100%;
          }
        }
      }
    }
  }

  .footerSection {
    margin-top: 8vh;
    border-top: 0.2px solid #e8e8e8;
    padding: 0px !important;
    padding-top: 20px !important;
    padding-bottom: 10px !important;

    font-size: 12px;
    .linksList {
      padding-left: 0px !important;
      a {
        margin-right: 20px;
        color: #4a4a4a;
      }
    }
    .copyright {
      padding-right: 0px !important;
      text-align: right;
    }

    @media #{$small-screen} {
      padding-top: 10px !important;

      .linksList {
        padding-right: 0px !important;
        text-align: center;
        a {
          margin-left: 10px;
          margin-right: 10px;
        }
      }

      .copyright {
        padding: 0px !important;
        text-align: center;
      }
    }
  }
}
</style>
