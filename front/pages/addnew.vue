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
        <div class="text">
          My idea:
        </div>
        <v-textarea outline name="input-7-4"></v-textarea>
        <div class="ideaEditor">
          <VueTrix v-model="ideaEditContents" class="editor" />
        </div>
        <div class="addNewTag">
          <v-btn color="primary">+ Add New Tag </v-btn>
        </div>

        <div class="submitBtn">
          <v-btn class="specialButton">Submit</v-btn>
        </div>
      </div>
    </v-layout>
  </Layout>
</template>
<script>
import Layout from '@/components/layout/Layout'

export default {
  components: { Layout },
  $_veeValidate: {
    validator: 'new'
  },
  data: () => ({
    ideaEditContents: ''
  }),
  created() {},
  mounted() {},
  methods: {}
}
</script>

<style lang="scss">
#createIdeaPage {
  background: white;
  min-height: 90vh;
  padding-top: 20px;
  padding-bottom: 2vh;
  display: block;
  width: 100%;
  overflow-x: hidden;
  overflow: auto;
  position: relative;

  .createIdeaBox {
    width: 50%;
    max-width: 600px;
    margin: auto;

    .text {
      font-size: 16px;
      margin-bottom: 10px;
    }

    .ideaEditor {
      .editor {
        .trix-content {
          height: 170px !important;
          max-height: 200px !important;
          overflow-y: auto;
        }
      }
    }

    .addNewTag {
      padding-top: 10px;
      margin: 0px;
    }

    .submitBtn {
      margin-top: 5vh;
      padding-top: 5vh;
      border-top: 1px solid #ddd;

      button {
        width: 100%;
        height: 50px;
        margin: 0px;
      }
    }
  }

  .backgroundLamp {
    padding-top: 10px;
    position: fixed;
    width: 300px;
    right: 20px;

    @media #{$small-screen} {
      left: 60%;
      top: 15vh;
      width: 80%;
      z-index: 0;
    }
  }
}
</style>
