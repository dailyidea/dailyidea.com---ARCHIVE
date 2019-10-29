<template>
  <Layout mobile-title="Daily Idea">
    <!--    <v-container>-->
    <div id="newhomePage">
      <!-- desktop view -->

      <v-row class="firstSection">
        <v-col cols="12" xl="1" class="hidden-lg-and-down"></v-col>
        <v-col md="5" xl="4" cols="12" class="futureListContainer">
          <div class="firstFreatureList">
            <div class="firstHeader">Your Idea Could Be Huge!</div>
            <div class="subHeader">
              That is, if you don't forget it !
            </div>
            <div class="descriptionSection">
              Submitting an idea every day is as simple as sending an email. We
              will store your ideas for you, so you can share them with your
              friends and conquer the world!
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
        </v-col>
        <v-col md="7" xl="6" cols="12">
          <div id="lampWomanImage"></div>
        </v-col>
        <v-col cols="12" xl="1" class="hidden-lg-and-down"></v-col>
      </v-row>

      <section class="ideaSection">
        <div class="ideaSectionHeader">
          Your Idea’s
        </div>

        <v-row>
          <v-col cols="12" xl="1" class="hidden-lg-and-down"></v-col>
          <v-col cols="12" xl="10">
            <v-row class="reviews">
              <v-col v-for="idea in ideas" :key="idea.ideaId" cols="12" md="4">
                <div color="white" class="reviews__review">
                  <div v-html="idea.content"></div>
                  <!-- User Icon -->
                  <div class="reviews__review__info">
                    <div class="reviews__review__info__detail">
                      <div
                        class="reviews__review__info__detail__image-container"
                      >
                        <img
                          alt="image"
                          class="reviews__review__info__detail__image"
                          src="~/assets/images/Oval.png"
                        />
                      </div>
                      <div
                        class="reviews__review__info__detail__name-container"
                      >
                        <div class="reviews__review__info__detail__name">
                          Boniface Esanji
                        </div>
                        <div class="reviews__review__info__detail__time">
                          {{ idea.relativeCreatedTime }}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </v-col>
            </v-row>
          </v-col>
          <v-col cols="12" xl="1" class="hidden-lg-and-down"></v-col>
        </v-row>

        <!-- Signup Button -->
        <div class="moreBrowseBtn">
          <v-btn color="primary" dark large rounded class="browseButton"
            >Browse More Ideas</v-btn
          >
        </div>
      </section>

      <section class="lastSection">
        <v-row>
          <v-col cols="12" xl="1" class="hidden-lg-and-down"></v-col>
          <v-col cols="12" md="6" xl="5">
            <div id="manAndTableImage"></div>
          </v-col>
          <v-col cols="12" md="6" xl="5">
            <div class="firstFreatureList">
              <div class="firstHeader">How it work’s?</div>
              <div class="subHeader">Oh, its easy!</div>

              <div class="descriptionSection">
                We’ll send you an email every day with a reminder for you to
                submit an idea. Just hit reply, and you’ll never forget an idea
                ever again.
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
          </v-col>
          <v-col cols="0" xl="1" class="hidden-lg-and-down">></v-col>
        </v-row>
      </section>

      <footer class="footerSection">
        <div class="linkContainer">
          <a>About us</a>
          <a>FAQ</a>
          <a>Terms % Conditions</a>
          <a>Privacy</a>
          <span class="copyRight"> Copyright @DailyIdea 2019</span>
        </div>
      </footer>
    </div>
    <!--    </v-container>-->
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
  computed: {
    lampsAndWomanImgUrl() {
      return require('~/assets/images/homeImage.png')
    }
  },
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

  .firstHeader {
    font-size: 40px;
    line-height: 1.2;
    color: #4a4a4a;
    font-weight: bolder;
  }

  .subHeader {
    margin-top: 3vh;
    font-size: 22px;
    color: #4a4a4a;
    line-height: 1.5;
  }

  .descriptionSection {
    @media (min-width: $screen-md-min) {
      margin-top: 7vh;
    }
    @media (max-width: $screen-sm-max) {
      margin-top: 5vh;
    }
    font-size: 18px;
    color: #4a4a4a;
    max-width: 500px;
  }

  #manAndTableImage {
    background-color: #fff;
    width: 100%;
    height: 100%;
    background-image: url('~assets/images/newLastImage.png');
    background-size: contain;
    background-position: center;

    @media (max-width: $screen-sm-max) {
      min-height: 40vh;
      margin-bottom: 5vh;
    }

    @media (min-width: $screen-md-min) {
      min-height: 50vh;
    }
  }

  #lampWomanImage {
    @media (max-width: $screen-sm-max) {
      margin-top: 4vh;
    }
    background-color: #fff;
    width: 100%;
    height: 100%;
    background-image: url('~assets/images/homeImage.png');
    background-size: contain;
    @media (max-width: $screen-sm-max) {
      background-position: center;
    }
    @media (min-width: $screen-md-min) {
      background-position: right;
    }
    min-height: 34vh;
  }

  .firstSection {
    margin: 0;
    background-size: cover;
    background-repeat: no-repeat;
    /*padding: 0px !important;*/
    padding-top: 4vh;

    .signupButton {
      margin-top: 5vh;
      width: 177px;
      background: #326bde !important;

      -webkit-box-shadow: 4px 26px 79px -11px rgba(50, 107, 222, 1);
      -moz-box-shadow: 4px 26px 79px -11px rgba(50, 107, 222, 1);
      box-shadow: 4px 26px 79px -11px rgba(50, 107, 222, 1);
    }

    .futureListContainer {
      .firstFreatureList {
        @media (min-width: $screen-md-min) {
          margin-top: 10vh;
        }
        text-align: left;
      }
    }
  }

  .ideaSection {
    @media (min-width: $screen-md-min) {
      margin-top: 10vh;
    }
    @media (max-width: $screen-sm-max) {
      margin-top: 5vh;
    }
    margin-bottom: 5vh;

    .ideaSectionHeader {
      @media (min-width: $screen-md-min) {
        margin-top: 20px;
        margin-bottom: 40px;
      }

      text-align: center;
      height: 26px;
      font-size: 19px;
      font-weight: 600;
      font-style: normal;
      font-stretch: normal;
      line-height: normal;
      letter-spacing: normal;
      color: #4a4a4a;
    }

    .reviews {
      &__review {
        position: relative;
        padding: 18px 25px;
        margin: auto;
        font-size: 14px;
        border-radius: 4px;
        background-color: #ffffff;
        border: solid 1px #d8e3f9;
        padding-bottom: 60px;
        height: 100%;

        &__info {
          border-top: 0.8px solid #e8e8e8;
          font-size: 12px;
          color: #777;
          padding-top: 5px;

          position: absolute;
          bottom: 5px;
          left: 25px;
          width: calc(100% - 50px);

          &__detail {
            font-size: 0;
            &__image-container {
              display: inline-block;
              width: 40px;
              height: 40px;
            }
            &__name-container {
              margin-left: 10px;
              display: inline-block;
              width: calc(100% - 50px);
            }
            &__image {
              height: 37px;
            }

            &__name {
              height: 16px;
              font-size: 12px;
              font-weight: 900;
              font-stretch: normal;
              font-style: normal;
              line-height: normal;
              letter-spacing: normal;
              color: #4a4a4a;
            }

            &__time {
              margin-top: 3px;
              font-size: 12px;
            }
          }
        }
      }
    }

    .moreBrowseBtn {
      @media (min-width: $screen-md-min) {
        margin-top: 10vh;
      }
      @media (max-width: $screen-sm-max) {
        margin-top: 5vh;
      }
      text-align: center;
      .browseButton {
        background: #326bde !important;
        width: 200px;
      }
    }
  }

  .lastSection {
    @media (min-width: $screen-md-min) {
      margin-top: 15vh;
    }
    @media (max-width: $screen-sm-max) {
      margin-top: 5vh;
    }
    background-size: cover;
    background-repeat: no-repeat;
    padding: 0px !important;
    .firstFreatureList {
      @media (min-width: $screen-md-min) {
        margin-top: 10vh;
      }
      .viewMoreButton {
        width: 200px;
        margin-top: 5vh;
        color: #326bde !important;
      }
    }
  }

  .footerSection {
    padding: 30px 20px;
    .linkContainer {
      border-top: 0.2px solid #e8e8e8;
      padding-top: 20px;
      @media (max-width: $screen-md-min) {
        text-align: center;
      }
      // text-align: center;
      a {
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        line-height: 2.33;
        letter-spacing: normal;
        color: #4a4a4a;
        @media (max-width: $screen-sm-max) {
          height: 56px;
          font-size: 12px;
          margin-left: 10px;
          margin-right: 10px;
        }
        @media (min-width: $screen-md-min) {
          height: 56px;
          font-size: 16px;
          margin-left: 20px;
          margin-right: 20px;
        }
      }

      .copyRight {
        @media (max-width: $screen-sm-max) {
          font-size: 12px;
          margin-bottom: 10px;
          text-align: center;
        }
        @media (min-width: $screen-md-min) {
          float: right;
          font-size: 16px;
        }
        height: 28px;
        font-weight: normal;
        font-stretch: normal;
        font-style: normal;
        line-height: 2.8;
        letter-spacing: normal;
        color: #4a4a4a;
      }
    }
  }
}
</style>
