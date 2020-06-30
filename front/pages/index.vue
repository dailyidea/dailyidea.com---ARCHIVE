<template>
  <Layout>
    <!--    <v-container>-->
    <div id="newhomePage">
      <!-- desktop view -->

      <section id="hero">
        <v-row>
          <v-col>
            <h1>Every Day, Log An Idea</h1>
          </v-col>
        </v-row>
        <v-row>
          <v-col sm="6" cols="12" class="d-flex align-center">
            <div>
              <p>A project idea, a startup idea, a work idea.</p>
              <p>
                We'll send you a daily email reminding you to submit an idea.
                Just respond to it and we'll save it for you.
              </p>

              <!-- header image only show above signup button on small viewports (1 column header) i.e. hide on larger viewport s-->
              <v-row class="d-flex d-sm-none">
                <v-col sm="6" cols="12" class="text-center">
                  <img
                    class="hero__image"
                    src="~/assets/images/home/undraw_counting_stars_rrnl.svg"
                  />
                </v-col>
              </v-row>

              <!-- Signup Button -->
              <div class="text-center text-sm-left">
                <v-btn dark rounded class="wider" :to="{ name: 'auth-signup' }"
                  >Sign Up
                </v-btn>
              </div>
            </div>
          </v-col>

          <!-- header image only show to the right on wider viewports (2 column header) -->
          <v-col sm="6" cols="12" class="justify-center d-none d-sm-flex">
            <img
              class="hero__image"
              src="~/assets/images/home/undraw_counting_stars_rrnl.svg"
            />
          </v-col>
        </v-row>
      </section>

      <section>
        <h2 class="text-center">Browse Popular Ideas</h2>

        <!-- Display idea cards -->
        <v-row>
          <v-col>
            <v-row class="reviews">
              <v-col v-for="idea in ideas" :key="idea.ideaId" cols="12" sm="4">
                <ideas-list-idea
                  :key="idea.ideaId"
                  preview
                  :idea="idea"
                  :show-author="showAuthor"
                ></ideas-list-idea>
              </v-col>
            </v-row>
          </v-col>
        </v-row>

        <!-- See More Button -->
        <div class="text-center">
          <v-btn outlined rounded class="wider" :to="{ name: 'ideas-all' }"
            >See More
          </v-btn>
        </div>
      </section>

      <section id="how-does-it-work">
        <v-row>
          <v-col cols="12" sm="6" class="text-center">
            <img
              class="img2"
              src="~/assets/images/home/undraw_donut_love_kau1.svg"
            />
          </v-col>
          <v-col cols="12" sm="6">
            <div class="last-section__feature-list">
              <h2 class="mb-4">How Does It Work?</h2>
              <p>
                <v-icon small>mdi-calendar-star</v-icon>
                We send you an email to remind you to submit an idea.
              </p>
              <p>
                <v-icon small>mdi-email-send-outline</v-icon>
                You just respond to the email with an idea and we store it for
                you.
              </p>
              <p>You'll also:</p>
              <p>
                <v-icon small>mdi-head-dots-horizontal-outline</v-icon>
                Practice generating ideas to become an idea machine
              </p>
              <p>
                <v-icon small>mdi-alarm</v-icon>
                Get reminded of your best ideas later
              </p>
              <p>
                <v-icon small>mdi-thought-bubble-outline</v-icon>
                Browse other ideas to inspire your own creativity
              </p>

              <div class="text-center text-sm-left">
                <v-btn dark rounded class="wider" :to="{ name: 'auth-signup' }"
                  >Sign Up
                </v-btn>
              </div>
            </div>
          </v-col>
        </v-row>
      </section>

      <main-footer />
    </div>
    <!--    </v-container>-->
  </Layout>
</template>

<script>
import clip from 'text-clipper'
import Layout from '@/components/layout/Layout'
import MainFooter from '@/components/layout/MainFooter'
import getPublicIdeas from '~/graphql/query/getPublicIdeas'
import ideasListIdea from '~/components/ideasList/ideasListIdea'

export default {
  components: {
    ideasListIdea,
    Layout,
    MainFooter
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
#hero {
  margin-bottom: 2rem;

  h1 {
    font-size: 24px;

    @media (min-width: $screen-sm-min) {
      font-size: 36px;
    }
  }
}

.hero__image,
.img2 {
  max-width: 200px;

  @media (min-width: $screen-sm-min) and (max-width: $screen-sm-max) {
    max-width: 280px;
  }

  @media (min-width: $screen-md-min) {
    max-width: 360px;
  }
}

a.v-btn.wider {
  margin-top: 3em;
  margin-bottom: 3rem;
  padding-left: 5rem;
  padding-right: 5rem;
}

#how-does-it-work {
  i.v-icon {
    color: $primary-color;
    padding-right: 0.5rem;
    vertical-align: baseline;
  }
}
</style>
