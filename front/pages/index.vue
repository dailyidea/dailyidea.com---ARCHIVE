<template>
  <Layout container-full>
    <idea-explorer />
  </Layout>
</template>

<script>
import clip from 'text-clipper'
import Layout from '@/components/layout/Layout'
import getPublicIdeas from '~/graphql/query/getPublicIdeas'
import IdeaExplorer from '@/components/IdeaExplorer'

export default {
  components: {
    Layout,
    IdeaExplorer
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
