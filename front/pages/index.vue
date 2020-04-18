<template>
  <Layout>
    <!--    <v-container>-->
    <div id="newhomePage">
      <!-- desktop view -->

      <v-row id="hero">
        <v-col
          md="6"
          cols="12"
        >
          <div>
            <h1>Every Day, Log An Idea</h1>
            <p>A project idea, a startup idea, a work idea</p>
            <p>
              We'll send you a daily email reminding you to submit an idea. Just
              respond to it and we'll save it for you.
            </p>

            <!-- Signup Button -->
            <v-btn
              normal
              dark
              rounded
              :to="{ name: 'auth-signup' }"
              >Sign Up
            </v-btn>
          </div>
        </v-col>
        <v-col md="6" cols="12" class="text-center">
          <img class="hero__image" src="~/assets/images/home/undraw_counting_stars_rrnl.svg" />
        </v-col>
      </v-row>

      <section id="idea-section">
        <h2>Browse Popular Ideas</h2>

        <!-- Display idea cards -->
        <v-row>
          <v-col>
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
        </v-row>

        <!-- See More Button -->
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

      <section>
        <v-row>
          <v-col cols="12" md="6" class="text-center">
            <img class="img2" src="~/assets/images/home/undraw_donut_love_kau1.svg" />
          </v-col>
          <v-col cols="12" md="6">
            <div class="last-section__feature-list">
              <h2>How Does It Work?</h2>
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

              <v-btn
                dark
                rounded
                :to="{ name: 'auth-signup' }"
                class="last-section__feature-list__view-more-btn"
                color="primary"
                >Sign Up
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </section>

      <footer>
        <v-row>
          <v-col cols="12" md="6" class="text-center text-md-left">
            <a>About</a>
            <a>FAQ</a>
            <a>Terms &amp; Conditions</a>
            <a>Privacy</a>
          </v-col>
          <v-col cols="12" md="6" class="text-center text-md-right">
            <span>Copyright Daily Idea © 2020</span>
          </v-col>
        </v-row>
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
  /* TODO: This should probably be somewhere global instead */
}

.hero__image, .img2 {
  max-width: 300px;
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

footer {
  border-top: .2px solid #e8e8e8;
  padding-top: 20px;

  a {
    padding-right: 1rem;
  }
}
</style>
