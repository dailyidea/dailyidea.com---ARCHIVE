<template>
  <Layout></Layout>
</template>

<script>
import Layout from '@/components/layout/Layout'

export default {
  components: {
    Layout
  },

  async fetch({ app, store, redirect, error }) {
    try {
      if (!store.getters['ideas/currIdea']) {
        await store.dispatch('ideas/getQueue', { app })
      }

      // Redirect to correct slug if it doesn't match
      const idea = store.getters['ideas/currIdea']
      if (!idea) {
        throw new Error('Ideas not found')
      }

      return redirect(301, `/i/${idea.shortId}/${idea.slug}?category=new`)
    } catch (e) {
      error({ statusCode: 404, message: 'Ideas not found' })
    }
  }
}
</script>
