<template>
  <div>
    <div class="creatideaform">
      <form data-vv-scope="create-idea-form" persistent max-width="400px">
        <v-card>
          <v-card-title style="text-align: center;">
            <span class="headline">Create Idea</span>
          </v-card-title>
          <v-card-text style="padding: 0px !important;">
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs12 sm12 md12>
                  <v-text-field
                    v-model="createideaForm.title"
                    v-validate="'required|max:100'"
                    label="Title"
                    :error-messages="
                      errors.collect('title', 'create-idea-form')
                    "
                    data-vv-name="title"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12 sm12 md12>
                  <VueTrix
                    v-model="createideaForm.ideaEditContents"
                    v-validate="'required|max:100'"
                    placeholder="Enter description"
                    :error-messages="
                      errors.collect('description', 'create-idea-form')
                    "
                    data-vv-name="description"
                  >
                  </VueTrix>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer> </v-spacer>

            <v-btn color="primary" @click="createIdea()">Create Idea </v-btn>
          </v-card-actions>
        </v-card>
      </form>
    </div>

    <!-- Bottom snackbar message -->
    <v-snackbar v-model="snackbarVisible" :timeout="6000">
      {{ snackbarMessage }}
      <v-btn color="white" text @click="snackbarVisible = false">
        Close
      </v-btn>
    </v-snackbar>
  </div>
</template>

<script>
export default {
  $_veeValidate: {
    validator: 'new'
  },

  data: () => ({
    snackbarVisible: false,
    snackbarMessage: '',
    createideaForm: {
      title: '',
      description: '',
      ideaEditContents: ''
    }
  }),

  methods: {
    async createIdea() {
      //Validate input fields
      let result = await this.$validator.validateAll('create-idea-form')
      if (!result) {
        return
      }

      this.snackbarMessage = 'create idea successfully.'
      this.snackbarVisible = true

      this.$router.push({ path: '/ideas' })
    }
  }
}
</script>

<style lang="scss">
.creatideaform {
  width: 1000px;
  padding-left: 350px;
  padding-top: 100px;
}

.ideaEditContents {
  margin: 0px;
  padding-top: 20px;
}
</style>
