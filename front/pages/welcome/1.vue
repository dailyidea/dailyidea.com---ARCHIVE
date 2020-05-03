<template>
  <v-container>
    <v-row>
      <v-col>
        <h1 class="page-title">
          Congrats and Welcome!
        </h1>
      </v-col>
    </v-row>

    <v-row>
      <v-col>

        <p>
          <span class="dailyText">Daily</span
          ><span class="ideaText">Idea</span> is a site where you can:
        </p>
        <ul>
          <li>
            Store your ideas so you can remember them and improve them over time
          </li>
          <li>Browse other folks's ideas to inspire yourself further</li>
        </ul>
      </v-col>
    </v-row>

    <v-row class="mt-3">
      <v-col>
        <v-btn block rounded :to="{name: 'welcome-2'}">Saving Your Ideas <v-icon small class="ml-2">mdi-arrow-right-circle</v-icon></v-btn>
      </v-col>
    </v-row>


  </v-container>
</template>

<script>
import { graphqlOperation } from '@aws-amplify/api'
import setWasWelcomed from '~/graphql/mutations/setWasWelcomed'

export default {
  name: 'Welcome1',
  data: () => ({
    email: null
  }),
  mounted() {
    this.setWasWelcomed()
  },
  methods: {
    setWasWelcomed() {
      this.$amplifyApi.graphql(
        graphqlOperation(setWasWelcomed, {
          userId: this.$store.getters['userData/userId']
        })
      )
    }
  }
}
</script>

<style scoped lang="scss">
@import '~assets/style/common';

.dailyText,
.ideaText {
  text-transform: uppercase;
  font-weight: 900;
  letter-spacing: 2px;
}

.dailyText {
  color: $primary-color;
}

.ideaText {
  color: $secondary-color;
}
</style>
