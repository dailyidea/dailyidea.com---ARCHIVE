<template>
  <div color="white" class="idea-item" @click="onIdeaClick(idea)">
    <div class="idea-item__title-row">
      <strong>{{ idea.title }}</strong>
    </div>
    <div>
      <idea-content :content="truncatedIdeaContent"></idea-content>
    </div>

    <!-- Idea metadata -->
    <div class="idea-item__info muted">
      <div class="idea-item__info__detail">
        <div
          class="idea-item__info__detail__image-container"
          :style="
            idea.authorAvatar
              ? {
                  'background-image': `url(${idea.authorAvatar})`
                }
              : {
                  'background-color': '#ebe7ed'
                }
          "
        >
          <v-icon v-if="!idea.authorAvatar">fas fa-user</v-icon>
        </div>
        <div class="idea-item__info__detail__name-container">
          <div class="idea-item__info__detail__name">
            {{ idea.authorName }}
          </div>
          <div class="idea-item__info__detail__time">
            {{ idea.createdDate | toRelativeDate }}
            <div class="comments-and-likes">
              <span
                >{{ idea.likesCount }}
                <v-icon small>mdi-thumb-up-outline</v-icon></span
              >
              <span
                >{{ idea.savesCount ? idea.savesCount : 0 }}
                <v-icon small>mdi-bookmark-outline</v-icon></span
              >
              <span
                >{{ idea.commentsCount }}
                <v-icon small>mdi-comment-multiple-outline</v-icon></span
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import clip from 'text-clipper'
import IdeaContent from '~/components/IdeaContent'
export default {
  name: 'IdeasListIdea',
  components: { IdeaContent },
  props: {
    idea: {
      type: Object,
      required: true
    },
    showAuthor: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    truncatedIdeaContent() {
      return clip(this.idea.content, 340, {
        html: true,
        maxLines: 8,
        indicator: '... (see more)'
      })
    }
  },
  methods: {
    onIdeaClick() {
      // custom behaviour might be required later
      this.$router.push({
        name: 'ideas-userId-ideaId',
        params: {
          ideaId: this.idea.ideaId,
          userId: this.idea.userId
        },
        force: true
      })
    }
  }
}
</script>

<style scoped lang="scss">
@import '~assets/style/common';

.idea-item {
  position: relative;
  border: solid 1px #d8e3f9;
  border-radius: 4px;

  margin-bottom: 20px;
  padding: 18px 25px 60px;

  cursor: pointer;
  word-break: break-word;
  font-size: 14px;
  height: 100%;

  &:hover {
    -webkit-box-shadow: 0 0 5px 3px #e3e3e361;
    -moz-box-shadow: 0 0 5px 3px #e3e3e361;
    box-shadow: 0 0 5px 3px #e3e3e361;
  }

  &__title-row {
    font-weight: bold;
    font-size: 1.25em;
    text-transform: capitalize;
    margin-bottom: 1.5rem;
  }

  &__info {
    border-top: 0.8px solid #e8e8e8;
    font-size: 12px;
    padding-top: 5px;

    position: absolute;
    bottom: 5px;
    left: 25px;
    width: calc(100% - 50px);

    &__detail {
      font-size: 0;

      &__image-container {
        vertical-align: middle;
        display: inline-block;
        width: 40px;
        height: 40px;
        line-height: 40px;
        text-align: center;
        border-radius: 50%;
        background-size: cover;
        background-repeat: no-repeat;
      }

      &__name-container {
        vertical-align: middle;
        margin-left: 10px;
        display: inline-block;
        width: calc(100% - 50px);
      }

      &__image {
        height: 37px;
      }

      &__name {
        height: 16px;
        font-size: 12px;
        font-weight: 900;
        font-stretch: normal;
        font-style: normal;
        line-height: normal;
        letter-spacing: normal;
        color: #4a4a4a;
      }

      &__time {
        margin-top: 3px;
        font-size: 12px;

        .comments-and-likes {
          float: right;
          margin-top: 3px;
          font-size: 12px;

          i.v-icon {
            vertical-align: text-top;
            color: $secondary-color;
          }
        }
      }
    }
  }
}
</style>
