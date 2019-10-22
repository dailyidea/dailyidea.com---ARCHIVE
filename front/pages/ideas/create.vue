<template>
  <Layout
    v-bind="{
      backButton: true,
      loggedInHeader: true,
      showPrivateIdeaBtn: true,
      mobileTitle: 'CREATE IDEA'
    }"
  >
    <v-layout id="createIdeaPage">
      <img class="backgroundLamp" src="~/assets/images/light_gray_lamp.png" />

      <div class="createIdeaBox">
        <!-- Header -->
        <v-layout class="text" hidden-sm-and-down>
          My idea:
          <div class="privateIconBtn">
            <v-icon class="privateIcon">fas fa-globe</v-icon>
          </div>
        </v-layout>

        <!-- title -->
        <v-textarea
          v-model="title"
          v-validate="'required|max:100'"
          :error-messages="errors.collect('title')"
          data-vv-name="title"
          outlined
          label="Idea Title"
        >
        </v-textarea>

        <!-- Descriptiion = trix editor -->
        <div class="ideaEditor">
          <VueTrix v-model="contents" class="editor" />
        </div>
        <div v-if="!contents" class="errorMsg">
          {{ errorMsg }}
        </div>

        <!-- Tags -->
        <v-combobox
          v-model="chips"
          v-validate="'required|max:100'"
          :error-messages="errors.collect('tag')"
          data-vv-name="tag"
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
    // sjahj: true,
    errorMsg: null,

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
      let result = await this.$validator.validateAll()
      if (!result) {
        this.errorMsg = 'This field is required.'
        return
      }

      this.creatingIdea = true

      try {
        let result = await this.$amplifyApi.graphql(
          graphqlOperation(createIdea, {
            content: this.contents,
            title: this.title
          })
        )

        this.creatingIdea = false
        this.ideaEditorVisible = false

        this.snackbarMessage = 'Idea Created'
        this.snackbarColor = 'success'
        this.snackbarVisible = true

        // Redirect to idea deail page
        let ideaId = result.data.createIdea.ideaId
        this.$router.push({
          name: 'ideas-userId-ideaId',
          params: { ideaId, userId: this.$store.getters['cognito/userSub'] },
          force: true
        })
      } catch (err) {
        this.creatingIdea = false
        this.snackbarMessage = 'Something went wrong!!'
        this.snackbarColor = 'error'
        this.snackbarVisible = true
        // console.error(err)
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
    .privateIconBtn {
      // float: right;
      // margin-left: 89%;
      .privateIcon {
        font-size: 15px;
      }
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
    .errorMsg {
      color: #b71c1c;
      font-size: 12px;
      margin-top: 2px;
      padding-left: 10px;
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
