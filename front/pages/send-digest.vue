<template>
  <static-page>
    <p class="title">Create Digest Mailing</p>

    <v-row>
      <v-col cols="6">
        <div v-for="idea in ideas" :key="idea.key" class="d-flex mb-2">
          <idea-autocomplete
            :error-message="idea.error"
            class="flex-grow-1"
            autocomplete="off"
            @change="v => onChange(idea, v)"
          />
          <v-btn icon class="mt-4" @click="removeIdea(idea)"
            ><v-icon>mdi-delete</v-icon></v-btn
          >
        </div>

        <div class="mt-4">
          <v-btn v-if="ideas.length < 6" @click="addIdea">Add Idea</v-btn>
        </div>
      </v-col>
      <v-col cols="6">
        <v-alert v-if="error" type="error">{{ error }}</v-alert>

        <v-text-field
          v-model="passcode"
          type="text"
          label="Passcode"
          autocomplete="off"
        />

        <div class="mt-4">
          <v-btn :loading="loading" @click="submit">Submit</v-btn>
        </div>
      </v-col>
    </v-row>
  </static-page>
</template>

<script>
import StaticPage from '@/components/layout/StaticPage'
import IdeaAutocomplete from '@/components/IdeaAutocomplete'
import sendDigest from '@/graphql/mutations/sendDigest'

export default {
  components: {
    IdeaAutocomplete,
    StaticPage
  },

  data: () => ({
    ideas: [],
    error: '',
    passcode: '',
    loading: false
  }),

  mounted() {
    this.addIdea()
    this.addIdea()
  },

  methods: {
    addIdea() {
      if (this.ideas.length === 6) return
      this.ideas.push({ key: Math.random().toString(), ideaId: '', error: '' })
    },

    removeIdea(idea) {
      this.ideas.splice(
        this.ideas.findIndex(i => i.key === idea.key),
        1
      )
    },

    onChange(idea, v) {
      idea.ideaId = v.ideaId
      this.validate()
    },

    validate() {
      this.error = ''
      if (!this.passcode) {
        this.error = 'Please type passcode'
      }

      if (this.ideas.filter(i => i.ideaId).length < 2) {
        this.error = 'Please select minumim two ideas'
      }

      this.ideas = this.ideas.map(i => {
        i.error = ''
        if (this.ideas.filter(id => i.ideaId === id.ideaId).length > 1) {
          i.error = 'Duplicate idea'
        }
        if (!i.ideaId) {
          i.error = 'Please find idea'
        }
        return i
      })
    },

    hasErrors() {
      return this.error || this.ideas.find(i => i.error !== '')
    },

    async submit() {
      this.validate()
      if (this.hasErrors()) return

      try {
        const result = await this.$amplifyApi.graphql({
          query: sendDigest,
          variables: {
            ideaIds: this.ideas.map(i => i.ideaId),
            passcode: this.passcode
          },
          authMode: 'API_KEY'
        })
        console.log(result)
      } catch (e) {
        console.error(e)
      }

      this.loading = false
    }
  }
}
</script>
