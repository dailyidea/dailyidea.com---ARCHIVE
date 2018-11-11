<template>
  <v-container>
    <v-layout row>
      <v-flex>
        <p class="title">{{ idea.title }}</p>
      </v-flex>
    </v-layout>
    <v-layout row>
      <v-flex>
        <p>by <nuxt-link :to="{ name: 'ideas-uid', params: {uid: user.id }}">{{ user.email }}</nuxt-link></p>
        <p>{{ idea.content }}</p>
      </v-flex>
    </v-layout>
  </v-container>
</template>


<script>
export default {
  asyncData() {
    return {
      idea: {
        id: 1,
        title: 'idea 1',
        date: new Date('2017-12-12T03:24:00'),
        content: 'some idea'
      },
      user: { email: 'blabla', id: 1 }
    }
  }
}
</script>
