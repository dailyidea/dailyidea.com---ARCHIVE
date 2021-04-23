<template>
  <Layout>
    <auth-flow
      v-model="showAuth"
      action="post"
      next="/ideas/create"
      :show-close-button="false"
      show-weclome-back-button
      persistent
      button-cancel-text="Go Back"
      @cancel="$router.go(-1)"
    />

    <idea-form v-model="form" :loading="creatingIdea" @submit="onCreateIdea" />
  </Layout>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex'
import { graphqlOperation } from '@aws-amplify/api'
import Layout from '@/components/layout/Layout'
import createIdea from '~/graphql/mutations/createIdea'
import AuthFlow from '@/components/auth/AuthFlow'
import IdeaForm from '@/components/ideas/IdeaForm'

export default {
  components: {
    AuthFlow,
    Layout,
    IdeaForm
  },

  data: () => ({
    form: {
      title: '',
      content: '',
      isPrivate: false,
      imageAttachments: [],
      fileAttachments: []
    },
    creatingIdea: false,
    showAuth: false
  }),

  computed: {
    ...mapGetters({
      userSlug: 'userData/slug'
    })
  },

  mounted() {
    if (!this.userSlug) {
      this.showAuth = true
    }
  },

  methods: {
    ...mapMutations({
      updateCreatedIdea: 'ideas/UPDATE_CREATED'
    }),

    async onCreateIdea() {
      this.creatingIdea = true

      try {
        const result = await this.$amplifyApi.graphql(
          graphqlOperation(createIdea, {
            content: this.form.content,
            title: this.form.title,
            tags: [],
            fileAttachments: this.form.fileAttachments,
            imageAttachments: this.form.imageAttachments,
            isPrivate: this.form.isPrivate
          })
        )

        this.$notifier.success('Idea Created')

        // Redirect to idea deail page
        const { shortId, slug, ideaId } = result.data.createIdea
        this.updateCreatedIdea(ideaId)

        if (this.isPrivate) {
          this.$router.push(`/profile/${this.userSlug}`)
        } else {
          this.$router.push({
            name: 'i-shortId-slug',
            params: { shortId, slug },
            force: true
          })
        }
      } catch (err) {
        this.$notifier.error(
          err === 'No current user'
            ? 'Please login first'
            : 'Something went wrong!'
        )
      }
      this.creatingIdea = false
    }
  }
}
</script>
