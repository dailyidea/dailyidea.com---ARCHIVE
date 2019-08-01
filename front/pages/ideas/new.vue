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
                    :error-messages="errors.collect('title')"
                    data-vv-name="title"
                  ></v-text-field>
                </v-flex>
                <v-flex xs12 sm12 md12>
                  <v-text-field
                    v-model="createideaForm.friendName"
                    v-validate="'required|max:100'"
                    label="description"
                    :error-messages="errors.collect('description')"
                    data-vv-name="description"
                  ></v-text-field>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="creatidea()">create</v-btn>
          </v-card-actions>
        </v-card>
      </form>
    </div>

    <!-- Bottom snackbar message -->
    <v-snackbar v-model="snackbarVisible" :timeout="6000">
      {{ snackbarMessage }}
      <v-btn color="white" flat @click="snackbarVisible = false">
        Close
      </v-btn>
    </v-snackbar>
  </div>
</template>

<script>
import Vue from 'vue'
import VeeValidate from 'vee-validate'

Vue.use(VeeValidate)
export default {
  $_veeValidate: {
    validator: 'new'
  },

  data: () => ({
    snackbarVisible: false,
    snackbarMessage: '',
    createideaForm: {
      title: '',
      description: ''
    },

    methods: {
      async creatidea() {
        //Validate input fields
        let result = await this.$validator.validateAll('create-idea-form')
        if (!result) {
          return
        }

        this.snackbarMessage = 'create idea successfully.'
        this.snackbarVisible = true
      }
    }
  })
}
</script>

<style lang="scss">
.creatideaform {
  width: 1000px;
  padding-left: 400px;
  padding-top: 100px;
}
</style>
