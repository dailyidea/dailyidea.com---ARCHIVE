<template>
  <Layout>
    <idea-form
      v-model="form"
      :loading="updatingIdea"
      button-text="Update"
      @submit="onUpdateIdea"
    />
  </Layout>
</template>
<script>
import { graphqlOperation } from '@aws-amplify/api'
import { mapGetters, mapMutations } from 'vuex'
import Layout from '@/components/layout/Layout'
import IdeaForm from '@/components/ideas/IdeaForm'
import getIdea from '@/graphql/query/getIdea'
import updateIdea from '@/graphql/mutations/updateIdea'

export default {
  components: {
    Layout,
    IdeaForm
  },

  async asyncData({ app, route, store, error }) {
    if (!store.getters['userData/isAuthenticated']) {
      return error({ statusCode: 401, message: 'Authentication required' })
    }

    const { shortId } = route.params

    try {
      const { data } = await app.$amplifyApi.graphql({
        query: getIdea,
        variables: { shortId },
        authMode: store.getters['userData/isAuthenticated']
          ? undefined
          : 'API_KEY'
      })

      // Redirect to correct slug if it doesn't match
      if (data.getIdea.userId !== store.getters['userData/userId']) {
        error({ statusCode: 403, message: 'Authorization error' })
      }
      return {
        idea: data.getIdea,
        form: {
          title: data.getIdea.title,
          content: data.getIdea.content,
          isPrivate: data.getIdea.visibility === 'PRIVATE',
          imageAttachments: data.getIdea.imageAttachments || [],
          fileAttachments: data.getIdea.fileAttachments || []
        }
      }
    } catch (e) {
      error({ statusCode: 404, message: 'Idea not found' })
    }
  },

  data: () => ({
    idea: null,
    form: {
      title: '',
      content: '',
      isPrivate: false,
      imageAttachments: [],
      fileAttachments: []
    },
    updatingIdea: false
  }),

  computed: {
    ...mapGetters({
      userSlug: 'userData/slug'
    })
  },

  methods: {
    ...mapMutations({
      cleanIdeas: 'ideas/CLEAN_IDEAS'
    }),

    async onUpdateIdea() {
      this.updatingIdea = true

      try {
        const result = await this.$amplifyApi.graphql(
          graphqlOperation(updateIdea, {
            ideaId: this.idea.ideaId,
            ideaOwnerId: this.idea.userId,
            content: this.form.content,
            title: this.form.title,
            tags: [],
            imageAttachments: this.form.imageAttachments || [],
            fileAttachments: this.form.fileAttachments || [],
            isPrivate: this.form.isPrivate
          })
        )

        this.$notifier.success('Idea Updated')
        this.cleanIdeas()

        // Redirect to idea deail page
        const { slug } = result.data.updateIdea.idea

        if (this.form.isPrivate) {
          this.$router.push(`/profile/${this.userSlug}`)
        } else {
          this.$router.push({
            name: 'i-shortId-slug',
            params: { shortId: this.idea.shortId, slug },
            force: true
          })
        }
      } catch (err) {
        this.$notifier.error('Something went wrong!')
      }
      this.updatingIdea = false
    }
  }
}
</script>
