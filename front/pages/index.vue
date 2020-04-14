<template>
  <Layout>
    <!--    <v-container>-->
    <div id="newhomePage">
      <!-- desktop view -->

      <v-row class="first-section">
        <v-col cols="12" xl="1" class="hidden-lg-and-down"></v-col>
        <v-col
          md="5"
          xl="4"
          cols="12"
          class="first-section__future-list-container"
        >
          <div class="first-section__future-list-container__feature-list">
            <div class="firstHeader">Every Day, Log An Idea</div>
            <div class="subHeader">
              A project idea, a startup idea, a work idea
            </div>
            <div class="descriptionSection">
              We'll send you a daily email reminding you to submit an idea. Just
              respond to it and we'll save it for you.
            </div>

            <!-- Signup Button -->
            <div class="actionBtn">
              <v-btn
                normal
                dark
                rounded
                class="first-section__signup-button"
                :to="{ name: 'auth-signup' }"
                color="#326bde"
                >Sign Up
              </v-btn>
            </div>
          </div>
        </v-col>
        <v-col md="7" xl="6" cols="12">
          <div id="lampWomanImage"></div>
        </v-col>
        <v-col cols="12" xl="1" class="hidden-lg-and-down"></v-col>
      </v-row>

      <section class="idea-section">
        <div class="idea-section__header">
          Browse Other People's Ideas
        </div>

        <v-row>
          <v-col cols="12" xl="1" class="hidden-lg-and-down"></v-col>
          <v-col cols="12" xl="10">
            <v-row class="reviews">
              <v-col v-for="idea in ideas" :key="idea.ideaId" cols="12" md="4">
                <div
                  color="white"
                  class="reviews__review"
                  @click="onIdeaClick(idea)"
                >
                  <div>
                    <strong>{{ idea.title }}</strong>
                  </div>
                  <div>
                    <idea-content
                      :content="getTruncatedIdeaContent(idea)"
                    ></idea-content>
                  </div>
                  <!-- User Icon -->
                  <div class="reviews__review__info">
                    <div class="reviews__review__info__detail">
                      <div
                        class="reviews__review__info__detail__image-container"
                        :style="
                          idea.authorAvatar
                            ? {
                                'background-image': `url(${idea.authorAvatar})`
                              }
                            : {}
                        "
                      >
                        <v-icon v-if="!idea.authorAvatar">fas fa-user</v-icon>
                      </div>
                      <div
                        class="reviews__review__info__detail__name-container"
                      >
                        <div class="reviews__review__info__detail__name">
                          {{ idea.authorName }}
                        </div>
                        <div class="reviews__review__info__detail__time">
                          {{ idea.createdDate | toRelativeDate }}
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
        <div class="idea-section__browse-more">
          <v-btn
            color="primary"
            outlined
            rounded
            :to="{ name: 'ideas-all' }"
            class="idea-section__browse-more__btn"
            >See More
          </v-btn>
        </div>
      </section>

      <section class="last-section">
        <v-row>
          <v-col cols="12" xl="1" class="hidden-lg-and-down"></v-col>
          <v-col class="last-section__left-side" cols="12" md="6" xl="5">
            <img
              class="person-with-phone"
              src="~/assets/images/person_with_phone.png"
            />
            <img class="mail-work" src="~/assets/images/home/mail_work.png" />
            <img
              class="lady-with-phone"
              src="~/assets/images/home/lady_with_phone.png"
            />
          </v-col>
          <v-col cols="12" md="6" xl="5">
            <div class="last-section__feature-list">
              <div class="firstHeader">How Does It Work?</div>

              <div class="descriptionSection">
                <p>
                  We send you an email to remind you to submit an idea. You just
                  respond to the email with an idea and we store it for you.
                </p>
                <p>You'll also:</p>
                <ul>
                  <li>Practice generating ideas to become an idea machine</li>
                  <li>Get reminded of your best ideas later</li>
                  <li>Browse other ideas to inspire your own creativity</li>
                </ul>
              </div>

              <!-- View More Button -->
              <v-btn
                dark
                rounded
                to="/auth/signup"
                class="last-section__feature-list__view-more-btn"
                color="primary"
                >Sign Up
              </v-btn>
            </div>
          </v-col>
          <v-col cols="0" xl="1" class="hidden-lg-and-down"></v-col>
        </v-row>
      </section>

      <footer class="footer-section">
        <div class="footer-section__link-container">
          <a class="footer-section__link">About</a>
          <a class="footer-section__link">FAQ</a>
          <a class="footer-section__link">Terms &amp; Conditions</a>
          <a class="footer-section__link">Privacy</a>
          <span class="footer-section__copy-right">
            Copyright Daily Idea © 2019</span
          >
        </div>
      </footer>
    </div>
    <!--    </v-container>-->
  </Layout>
</template>

<script>
import clip from 'text-clipper'
import Layout from '@/components/layout/Layout'
import getPublicIdeas from '~/graphql/query/getPublicIdeas'
import IdeaContent from '~/components/IdeaContent'

export default {
  components: { Layout, IdeaContent },
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
  data: () => ({
    mobileHeaderUiOptions: {
      pageTitle: '',
      leftButtonType: 'hamburder'
    },
    ideas: null
  }),
  computed: {
    lampsAndWomanImgUrl() {
      return require('~/assets/images/homeImage.png')
    }
  },
  created() {},
  methods: {
    getTruncatedIdeaContent(idea) {
      return clip(idea.content, 250, {
        html: true,
        maxLines: 8,
        indicator: '... (see more)'
      })
    },
    onIdeaClick(idea) {
      this.$router.push({
        name: 'ideas-userId-ideaId',
        params: {
          ideaId: idea.ideaId,
          userId: idea.userId
        },
        force: true
      })
    }
  }
}
</script>
<style lang="scss" scoped>
#newhomePage {
  background: white;
  font-family: Avenir;
}

#lampWomanImage {
  @media (max-width: $screen-sm-max) {
    margin-top: 4vh;
  }
  background-color: #fff;
  width: 100%;
  height: 100%;
  background-image: url('~assets/images/home/person_2.png'),
    url('~assets/images/home/person_3.png'),
    url('~assets/images/yellowBulb.png');
  background-repeat: no-repeat;
  $mobile-height: 40vh;

  @media (max-width: $screen-sm-max) {
    background-position: calc(100% - #{$mobile-height / 2.3}) 100%, bottom right,
      top left;
    background-size: auto $mobile-height, auto $mobile-height,
      #{$mobile-height / 2.5};
    min-height: $mobile-height;
  }
  @media (min-width: $screen-md-min) and (max-width: $screen-md-max) {
    background-position: 38% 100%, bottom right, top left;
    background-size: auto 70%, auto 70%, auto 25%;
  }
  @media (min-width: $screen-lg-min) {
    background-position: 38% 100%, bottom right, top left;
    background-size: auto 100%, auto 100%, auto 30%;
  }
}

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

.first-section {
  margin: 0;
  background-size: cover;
  background-repeat: no-repeat;
  /*padding: 0px !important;*/
  padding-top: 4vh;

  &__signup-button {
    margin-top: 5vh;
    width: 177px;
    -webkit-box-shadow: 4px 26px 79px -11px $primary-color;
    -moz-box-shadow: 4px 26px 79px -11px $primary-color;
    box-shadow: 4px 26px 79px -11px $primary-color;
  }

  &__future-list-container {
    &__feature-list {
      @media (min-width: $screen-md-min) {
        margin-top: 10vh;
      }
      text-align: left;
    }
  }
}

.idea-section {
  margin-bottom: 5vh;
  @media (min-width: $screen-md-min) {
    margin-top: 10vh;
  }
  @media (max-width: $screen-sm-max) {
    margin-top: 5vh;
  }

  &__header {
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

  &__browse-more {
    @media (min-width: $screen-md-min) {
      margin-top: 10vh;
    }
    @media (max-width: $screen-sm-max) {
      margin-top: 5vh;
    }
    text-align: center;

    &__btn {
      width: 200px;
    }
  }
}

.reviews {
  &__review {
    word-break: break-word;
    position: relative;
    padding: 18px 25px;
    margin: auto;
    font-size: 14px;
    border-radius: 4px;
    background-color: #ffffff;
    border: solid 1px #d8e3f9;
    padding-bottom: 60px;
    height: 100%;
    cursor: pointer;

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
          vertical-align: middle;
          display: inline-block;
          width: 40px;
          height: 40px;
          line-height: 40px;
          text-align: center;
          background-color: #ebe7ed;
          border-radius: 50%;
          background-size: cover;
          background-repeat: no-repeat;
        }

        &__name-container {
          vertical-align: middle;
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

.last-section {
  @media (min-width: $screen-md-min) {
    margin-top: 15vh;
  }
  @media (max-width: $screen-sm-max) {
    margin-top: 5vh;
  }
  background-size: cover;
  background-repeat: no-repeat;
  padding: 0px !important;

  &__left-side {
    display: flex; // make us of Flexbox
    align-items: center;
    justify-content: center;
    position: relative;

    @media #{$small-screen} {
      margin-top: 5vh;
      height: 45vh;
      // mrgin-bottom: 5vh;
    }

    .person-with-phone {
      position: absolute;
      overflow: hidden;
      height: 60vh;
      top: 1vh;
      left: 5%;

      @media #{$small-screen} {
        height: 40vh;
        left: 10%;
      }
    }

    .mail-work {
      width: 70%;
      margin-left: 10%;
    }

    .lady-with-phone {
      position: absolute;
      overflow: hidden;
      height: 55vh;
      top: 5vh;
      right: 10%;

      @media #{$small-screen} {
        height: 40vh;
        top: 0vh;
        right: 3%;
      }
    }
  }

  &__feature-list {
    @media (min-width: $screen-md-min) {
      margin-top: 10vh;
    }

    &__view-more-btn {
      width: 200px;
      margin-top: 5vh;
    }
  }
}

.footer-section {
  padding: 30px 20px;

  &__link-container {
    border-top: 0.2px solid #e8e8e8;
    padding-top: 20px;
    @media (max-width: $screen-md-min) {
      text-align: center;
    }
    // text-align: center;
  }

  &__link {
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

    &__copy-right {
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
</style>
