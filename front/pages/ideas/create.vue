<template>
  <Layout
    v-bind="{
      backButton: true,
      loggedInHeader: true,
      mobileTitle: 'CREATE IDEA'
    }"
  >
    <v-layout id="createIdeaPage">
      <img class="backgroundLamp" src="~/assets/images/light_gray_lamp.png" />

      <div class="createIdeaBox">
        <!-- Header -->
        <v-layout class="text" hidden-sm-and-down>
          My idea:
        </v-layout>

        <!-- title -->
        <v-textarea v-model="title" outlined label="Idea Title"> </v-textarea>

        <!-- Descriptiion = trix editor -->
        <div class="ideaEditor">
          <VueTrix v-model="contents" class="editor" />
        </div>

        <!-- Tags -->
        <v-combobox
          v-model="chips"
          class="ideaTag"
          :items="items"
          chips
          clearable
          multiple
          outlined
          label="Add Tags"
        >
          <template v-slot:selection="{ attrs, item, select, selected }">
            <v-chip
              v-bind="attrs"
              :input-value="selected"
              close
              label
              @click="select"
              @click:close="remove(item)"
            >
              <strong>{{ item }}</strong>
            </v-chip>
          </template>
        </v-combobox>

        <!-- Submit -->
        <div class="submitBtn">
          <v-btn :loading="creatingIdea" @click="onCreateIdea">Submit</v-btn>
        </div>
      </div>

      <!-- Bottom snackbar message -->
      <v-snackbar
        v-model="snackbarVisible"
        :timeout="2000"
        :color="snackbarColor"
      >
        {{ snackbarMessage }}
        <v-btn color="white" text @click="snackbarVisible = false">
          Close
        </v-btn>
      </v-snackbar>
    </v-layout>
  </Layout>
</template>
<script>
import { graphqlOperation } from '@aws-amplify/api'
import Layout from '@/components/layout/Layout'
import createIdea from '~/graphql/mutations/createIdea'

export default {
  components: { Layout },
  $_veeValidate: {
    validator: 'new'
  },
  data: () => ({
    contents: '',
    title: '',
    creatingIdea: false,
    chips: [],

    snackbarVisible: false,
    snackbarMessage: '',
    snackbarColor: 'success'
  }),
  created() {},
  mounted() {},
  methods: {
    remove(item) {
      this.chips.splice(this.chips.indexOf(item), 1)
      this.chips = [...this.chips]
    },
    async onCreateIdea() {
      this.creatingIdea = true

      try {
        await this.$amplifyApi.graphql(
          graphqlOperation(createIdea, {
            content: this.contents,
            title: this.title
          })
        )
        this.creatingIdea = false
        this.ideaEditorVisible = false

        this.snackbarMessage = 'Idea Updated'
        this.snackbarColor = 'success'
        this.snackbarVisible = true
      } catch (err) {
        this.creatingIdea = false
        this.snackbarMessage = 'Something went wrong!!'
        this.snackbarColor = 'error'
        this.snackbarVisible = true
        debugger
        console.error(err)
      }
    }
  }
}
</script>

<style lang="scss">
#createIdeaPage {
  background: white;
  min-height: 94vh;
  width: 100%;
  overflow-x: hidden;

  .createIdeaBox {
    width: 45%;
    margin-left: auto;
    margin-right: auto;
    margin-top: 4vh;

    @media #{$small-screen} {
      width: 90%;
    }

    .text {
      font-size: 16px;
      margin-bottom: 10px;
    }

    .ideaEditor {
      font-size: 14px;

      @media #{$small-screen} {
        font-size: 8px;
      }

      .editor {
        .trix-content {
          height: 170px !important;
          max-height: 200px !important;
          overflow-y: auto;
        }
      }
    }

    .ideaTag {
      padding-top: 30px;

      .v-chip {
        background-color: rgba(192, 183, 197);
        color: white;

        i {
          color: white;
        }
      }
      .v-icon.mdi-menu-down {
        display: none;
      }
      .v-input__append-inner {
        display: none;
      }
    }

    .submitBtn {
      margin-top: 5vh;

      button {
        width: 100%;
        height: 50px;
        margin: 0px;
      }
    }
  }

  .backgroundLamp {
    position: fixed;
    top: 20vh;
    right: 5%;
    width: 20%;

    @media #{$small-screen} {
      top: 20vh;
      right: -40%;
      width: 80%;
    }
  }
}
</style>