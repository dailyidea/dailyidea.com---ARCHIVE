<template>
  <v-container>
    <v-row>
      <v-col>
        <template v-if="routeName == 'ideas-me'">
          <div class="text-center">
            <div class="mb-10">
              <v-icon large>mdi-lightbulb-outline</v-icon>
            </div>

            <h2 class="my-5">Welcome to Daily Idea</h2>
            <p>You don't have any ideas yet, but once you do, they'll show up here.</p>
            <v-btn
              rounded
              class="my-5"
              :to="{name: 'ideas-create'}"
              >
              <v-icon small class="mr-3">mdi-plus-circle</v-icon>
              Add idea
            </v-btn>
            <p class="muted mt-10">
              Not ready to add an idea yet? <router-link :to="{name: 'ideas-all'}">Browse other people's ideas</router-link>
            </p>
          </div>
        </template>

        <template v-if="routeName == 'ideas-liked'">
          <div class="text-center">
            <div class="my-10">
              <v-icon large>mdi-bookmark-remove-outline</v-icon>
            </div>

            <h2 class="my-5">No Saved Ideas</h2>
            <p>You haven't saved any ideas yet, but once you do, they'll show up here.</p>
            <p>
              <router-link :to="{name: 'ideas-all'}">Browse other ideas</router-link> on the site to save ideas you like.
            </p>
          </div>
        </template>

      </v-col>
    </v-row>
  </v-container>

</template>

<script>
export default {
  name: 'IdeasListEmptyMessage',
  computed: {
    routeName() {
      return this.$route.name
    }
  }
}
</script>

<style scoped lang="scss">
</style>
