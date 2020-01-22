<template>
  <div class="commentItem">
    <div class="header">
      <div class="commentUser">
        <span v-if="!comment.fake">{{ comment.userName }}</span>
        <v-skeleton-loader v-else light height="14" type="text" min-width="90">
        </v-skeleton-loader>
      </div>
      <div class="timing">
        <span v-if="!comment.fake">{{
          comment.createdDate | toRelativeDate
        }}</span>
        <v-skeleton-loader v-else light height="14" type="text" min-width="90">
        </v-skeleton-loader>
        <v-btn
          v-if="deletable && !comment.fake"
          class="deleteCommentBtn"
          color="red"
          icon
          text
          x-small
          @click="onDeleteComment"
        >
          <v-icon color="#8b868e" :size="13">fas fa-trash-alt</v-icon>
        </v-btn>
      </div>
    </div>
    <div class="commentText">
      <span v-if="!comment.fake">
        {{ comment.body }}
      </span>
      <v-skeleton-loader v-else light height="21" type="text">
      </v-skeleton-loader>
    </div>
  </div>
</template>

<script>
export default {
  name: 'IdeaCommentsComment',
  props: {
    comment: {
      type: Object
    },
    deletable: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    onDeleteComment() {
      this.$emit('onDeleteComment', this.comment)
    }
  }
}
</script>

<style scoped lang="scss">
.commentItem {
  margin: 15px;
  padding: 10px;
  background-color: #ffffff;
  border-radius: 0px 7px 7px 7px;

  @media #{$small-screen} {
    border-left: 0px;
    border-right: 0px;
    border-bottom: none;
    margin-top: 0px;
  }

  .header {
    .commentUser {
      display: inline-block;
      vertical-align: top;
      font-size: 12px;
      color: #b5b5b5;
    }

    .timing {
      vertical-align: top;
      float: right;
      font-size: 12px;
      text-align: right;
      color: #c0b7c5;
    }
  }

  .commentText {
    width: 100%;

    @media #{$small-screen} {
      padding-top: 3px;
    }

    font-size: 14px;
    color: #827c85;
  }
}
</style>
