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
        <v-textarea outlined label="Idea Title"> </v-textarea>

        <!-- Descriptiion = trix editor -->
        <div class="ideaEditor">
          <VueTrix v-model="ideaEditContents" class="editor" />
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
          <v-btn>Submit</v-btn>
        </div>
      </div>

      <!-- desktop view-->
      <!-- <v-layout class="desktop" hidden-sm-and-down>
        

        <div class="createIdeaBox">
          
          <v-textarea outlined label="Idea Title"> </v-textarea>
          <div class="ideaEditor">
            <VueTrix v-model="ideaEditContents" class="editor" />
          </div>

          <v-combobox v-model="chips" class="ideaTag" :items="items" chips clearable multiple outlined label="Add Tags">
            <template v-slot:selection="{ attrs, item, select, selected }">
              <v-chip v-bind="attrs" :input-value="selected" close label @click="select" @click:close="remove(item)">
                <strong>{{ item }}</strong>
              </v-chip>
            </template>
          </v-combobox>


          <div class="submitBtn">
            <v-btn>Submit</v-btn>
          </div>
        </div>
      </v-layout> -->
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
    ideaEditContents: '',
    chips: []
  }),
  created() {},
  mounted() {},
  methods: {
    remove(item) {
      this.chips.splice(this.chips.indexOf(item), 1)
      this.chips = [...this.chips]
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

      .v-input__icon {
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
