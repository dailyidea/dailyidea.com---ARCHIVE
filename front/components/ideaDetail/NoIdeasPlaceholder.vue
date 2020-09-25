<template>
  <idea-card expanded>
    <div class="d-flex justify-space-between align-content-space-between">
      <div class="flex-shrink-0">
        <img
          class="card-image"
          src="~assets/images/idea-card/empty-state-my-ideas.png"
          alt="No ideas"
        />
      </div>
      <div class="d-flex justify-center align-center">
        <span class="card-title">{{ title }}</span>
      </div>
      <v-btn
        :to="{ name: 'ideas-create' }"
        class="card-button d-flex justify-center align-center flex-shrink-0"
      >
        +
      </v-btn>
    </div>
  </idea-card>
</template>

<script>
import IdeaCard from '~/components/ideaDetail/IdeaCard'

export default {
  components: {
    IdeaCard
  },

  props: {
    title: {
      type: String,
      required: true
    }
  }
}
</script>

<style scoped lang="scss">
.card {
  max-width: 409px;
  margin: auto !important;
  padding: 0 !important;
  overflow: hidden;
}
.card-image {
  margin: 0.75rem 0 0.75rem 0.5rem;
  width: 135px;
}
.card-title {
  font-size: 18px;
  padding: 1rem;
}
.card-button {
  width: 48px !important;
  height: auto !important;
  padding: 0 !important;
  min-width: 0 !important;
  background-color: $primary-color !important;
  border-radius: 0;
  color: white;
  font-size: 28px;
}
</style>
