<template>
  <Layout v-bind="{
      loggedInHeader: true,
      mobileTitle: 'My Ideas',
      mobileHamburger: true,
      mobileSearchIcon: true
    }">
    <div>lkjsdf</div>
  </Layout>
</template>

<script>
import { graphqlOperation } from '@aws-amplify/api'

import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import likedIdeas from '~/graphql/query/likedIdeas'
import Layout from '@/components/layout/Layout'
dayjs.extend(relativeTime)

export default {
  components: { Layout },

  data: () => ({
    snackbarVisible: false,
    snackbarMessage: '',
    snackbarColor: 'success'
  }),

  async asyncData({ app, params, store }) {
    console.log('user is ', store.getters['cognito/userSub'])
    const { ideas } = await app.$amplifyApi.graphql(
      graphqlOperation(likedIdeas)
    )
    console.log('idea is ', ideas)
    // console.log('liked idea list is', ideas)
    // return {
    //   ideas: ideas.items
    // }
  },
  created() {
    // this.idea.relativeCreatedTime = dayjs(this.idea.createdDate).fromNow()
    // this.ideas.forEach(idea => {
    //   idea.relativeCreatedTime = dayjs(idea.createdDate).fromNow()
    // })
  },

  methods: {}
}
</script>

<style lang="scss">
#likedIdeaListPage {
  padding-top: 50px;
  background: white;
  min-height: 100vh;
  padding-bottom: 2vh;
  display: block;
  width: 100%;
  overflow-x: hidden;

  padding-right: 3%;
  padding-left: 2%;

  .addBtn {
    position: fixed;
    right: 40px;
    bottom: 30px;
  }

  @media #{$small-screen} {
    padding-top: 0vh;
  }

  .titleDiv {
    text-align: center;
    // border: 1px solid red;
    min-height: 30px;

    .titleText {
      display: inline-block;
      margin-bottom: 20px;

      font-size: 17px;
      font-weight: 600;
      font-style: normal;
      font-stretch: normal;
      line-height: 1.59;
      letter-spacing: 0.51px;
      text-align: center;
      color: #232323;
    }

    .sortBy {
      font-size: 14px;
      font-weight: normal;
      font-style: normal;
      font-stretch: normal;
      line-height: 1.57;
      letter-spacing: normal;
      text-align: left;
      color: #35124e;

      float: right;
      text-align: right;

      @media #{$small-screen} {
        float: left;
        text-align: left;
        padding-left: 5%;
        font-size: 12px;
        padding-top: 10px;
      }

      i {
        font-size: 17px;
        padding-right: 7px;
        color: #35124e;
      }
    }
  }

  .ideaList {
    margin-left: -10px;
    margin-right: -10px;

    @media #{$small-screen} {
      padding-right: 0%;
      padding-left: 0%;
    }

    .ideaContainer {
      padding: 10px 10px;

      @media #{$small-screen} {
        padding: 0px !important;

        &:last-child {
          border-bottom: solid 1px rgba(228, 228, 228, 0.38);
        }
      }

      .ideaItem {
        border: solid 1px rgba(228, 228, 228, 0.38);
        padding: 15px 20px;
        cursor: pointer !important;

        &:hover {
          -webkit-box-shadow: 0px 0px 5px 3px #e3e3e361;
          -moz-box-shadow: 0px 0px 5px 3px #e3e3e361;
          box-shadow: 0px 0px 5px 3px #e3e3e361;
        }

        @media #{$small-screen} {
          border-left: 0px;
          border-right: 0px;
          border-bottom: none;
          margin-top: 0px;
        }

        .ideaDescription {
          width: 100%;
          display: block;
          overflow-wrap: break-word;
          min-height: 50px;

          @media #{$small-screen} {
            padding-top: 3px;
            min-height: 10px;
          }

          font-size: 16px;
          font-weight: normal;
          font-style: normal;
          font-stretch: normal;
          line-height: 1.5;
          letter-spacing: normal;
          text-align: left;
          color: #18141c;
        }

        .engagement {
          display: block;
          margin-top: 10px;
          margin-bottom: 5px;
          font-size: 14px;
          font-weight: normal;
          font-style: normal;
          font-stretch: normal;
          letter-spacing: normal;
          text-align: left;
          color: #c0b7c5;

          img {
            height: 14px;
            margin-right: 5px;
          }

          .ups {
            display: inline-block;
            height: 18px;
          }

          .downs {
            margin-left: 20px;
            display: inline-block;
          }

          .timing {
            float: right;
            font-size: 12px;
            font-weight: normal;
            font-style: normal;
            font-stretch: normal;
            line-height: 1.83;
            letter-spacing: normal;
            text-align: right;
            color: #c0b7c5;
            cursor: pointer !important;
          }
        }
      }
    }
  }

  .noIdeaFoundDiv {
    text-align: center;
    display: flex;
    flex-direction: column;
    align-content: stretch;
    height: 93vh;
    padding-bottom: 60px;
    align-items: center;

    .lampImg {
      margin-top: 15vh;
      height: 30vh;
    }

    .text {
      margin-top: 3vh;
      margin-bottom: 3vh;
      font-size: 20px;
      color: #c0b7c5;
    }

    .arrowImg {
      display: none;

      @media #{$small-screen} {
        display: block;
        width: 20%;
        margin-left: 30%;
      }
    }
  }
}
</style>
