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
import { mapMutations } from 'vuex'
import { graphqlOperation } from '@aws-amplify/api'
import Layout from '@/components/layout/Layout'
import createIdea from '~/graphql/mutations/createIdea'
import IdeaForm from '@/components/ideas/IdeaForm'
import getIdea from '@/graphql/query/getIdea'

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
          isPrivate: data.getIdea.visibility === 'PRIVATE'
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

  methods: {
    ...mapMutations({
      updateCreatedIdea: 'ideas/UPDATE_CREATED'
    }),

    async onUpdateIdea() {
      this.updatingIdea = true

      try {
        const result = await this.$amplifyApi.graphql(
          graphqlOperation(createIdea, {
            content: this.form.contents,
            title: this.form.title,
            tags: [],
            fileAttachments: this.form.fileAttachments,
            imageAttachments: this.form.imageAttachments,
            isPrivate: this.form.isPrivate
          })
        )

        this.$notifier.success('Idea Updated')

        // Redirect to idea deail page
        const { shortId, slug } = result.data.createIdea

        if (this.form.isPrivate) {
          this.$router.push(`/profile/${this.userSlug}`)
        } else {
          this.$router.push({
            name: 'i-shortId-slug',
            params: { shortId, slug },
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
