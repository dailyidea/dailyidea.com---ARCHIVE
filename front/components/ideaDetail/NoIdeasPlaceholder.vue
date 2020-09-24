<template>
  <idea-card expanded>
    <div class="card-container p-3">
      <span class="card-title">{{ title }}</span>
      <img
        class="py-6"
        src="~/assets/images/idea-card/no-ideas-placeholder.png"
      />
      <span class="card-body">{{ body }}</span>
      <nuxt-link to="/" class="link-highlight mt-7">
        Explore ideas
      </nuxt-link>
    </div>
  </idea-card>
</template>

<script>
import IdeaCard from '~/components/ideaDetail/IdeaCard'

export default {
  name: 'NoIdeasPlaceholder',
  components: {
    IdeaCard
  },
  props: {
    title: {
      type: String,
      required: true
    },

    body: {
      type: String,
      required: true
    }
  }
}
</script>

<style scoped lang="scss">
a {
  text-decoration: none;
}

.card-container {
  img {
    width: 40%;
  }

  .card-title {
    text-align: center;
    font-size: 2rem;
    font-weight: 300;
  }

  .card-body {
    font-size: 1rem;
  }

  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
}
</style>
