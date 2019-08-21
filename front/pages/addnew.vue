<template>
  <Layout
    v-bind="{
      backButton: true,
      loggedInHeader: true,
      mobileTitle: 'CREATE IDEA'
    }"
  >
    <v-layout id="createIdeaPage">
      <!--mobile view-->
      <v-layout inline-block class="mobile" hidden-md-and-up>
        <div class="createIdeaBox">
          <v-textarea outlined label="Idea Title"> </v-textarea>
          <div class="ideaEditor">
            <VueTrix v-model="ideaEditContents" class="editor" />
          </div>
          <div class="addNewTag">
            <div class="header">
              <h1>+ Add Tag</h1>
            </div>
            <v-combobox
              v-model="chips"
              class="ideaTag"
              :items="items"
              chips
              clearable
              multiple
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
          </div>
          <div class="submitBtn">
            <v-btn>Submit</v-btn>
          </div>
        </div>
      </v-layout>

      <!-- desktop view-->

      <v-layout class="desktop" hidden-sm-and-down>
        <img class="backgroundLamp" src="~/assets/images/light_gray_lamp.png" />

        <div class="createIdeaBox">
          <div class="text">
            My idea:
          </div>
          <v-textarea outlined label="Idea Title"> </v-textarea>
          <div class="ideaEditor">
            <VueTrix v-model="ideaEditContents" class="editor" />
          </div>
          <div class="addNewTag">
            <div class="header">
              <h1>+ Add Tag</h1>
            </div>
            <v-combobox
              v-model="chips"
              class="ideaTag"
              :items="items"
              chips
              clearable
              multiple
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
          </div>

          <div class="submitBtn">
            <v-btn>Submit</v-btn>
          </div>
        </div>
      </v-layout>
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
      font-size: 14px;
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

      .header {
        font-size: 8px;
      }

      .ideaTag {
        .v-chip {
        }

        .v-input__icon {
          display: none;
        }
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

  .mobile {
    background: white;
    .createIdeaBox {
      width: 80%;
    }
    .ideaEditor {
      font-size: 8px;
    }
    .addNewTag {
      .header {
      }
      .ideaTag {
        padding-top: 5px;
        .v-chip {
        }
      }
    }
    .submitBtn {
      margin: 0px;
      padding-bottom: 5vh;
    }
  }
}
</style>
