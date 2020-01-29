<template>
  <div class="idea-item" @click="onIdeaClick">
    <div class="idea-item__idea-title-row">
      {{ idea.title }}
    </div>
    <div class="idea-item__idea-content-row">
      <idea-content :content="idea.content"></idea-content>
    </div>
    <div class="idea-item__idea-footer-row">
      <div class="idea-item__idea-footer-row__counters">
        <div class="idea-item__idea-footer-row__likes-counter">
          <div
            class="idea-item__idea-footer-row__likes-counter__image"
            :class="{ active: idea.likesCount > 0 }"
          ></div>
          <div class="idea-item__idea-footer-row__likes-counter__label">
            <span>{{ idea.likesCount }}</span>
          </div>
        </div>
        <div class="idea-item__idea-footer-row__comments-counter">
          <div
            class="idea-item__idea-footer-row__comments-counter__image"
          ></div>
          <div class="idea-item__idea-footer-row__comments-counter__label">
            <span>{{ idea.commentsCount }}</span>
          </div>
        </div>
      </div>
      <div class="idea-item__idea-footer-row__time">
        {{ idea.createdDate | toRelativeDate }}
      </div>
    </div>
  </div>
</template>

<script>
import IdeaContent from '~/components/IdeaContent'
export default {
  name: 'IdeasListIdea',
  components: { IdeaContent },
  props: {
    idea: {
      type: Object,
      required: true
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
.idea-item {
  padding: 15px 20px;
  margin-bottom: 20px;
  border: solid 1px rgba(228, 228, 228, 0.38);
  cursor: pointer;

  &:hover {
    -webkit-box-shadow: 0 0 5px 3px #e3e3e361;
    -moz-box-shadow: 0 0 5px 3px #e3e3e361;
    box-shadow: 0 0 5px 3px #e3e3e361;
  }

  &__idea-title-row {
    /*background-color: rgba(119, 119, 119, 0.3);*/
  }

  &__idea-content-row {
    /*background-color: rgba(6, 75, 13, 0.35);*/
    margin-bottom: 15px;
    margin-top: 10px;
    font-size: 14px;
    text-align: left;
    color: #827c85;
    overflow: hidden;
    word-break: break-all;
  }

  &__idea-footer-row {
    /*background-color: rgba(74, 46, 4, 0.22);*/
    height: 30px;
    padding: 5px 0;
    font-size: 0;
    @mixin label-style {
      display: inline-block;
      vertical-align: bottom;
      height: 14px;
      font-size: 14px;
      line-height: 18px;
      color: #c0b7c5;
    }
    @mixin image-style {
      vertical-align: bottom;
      display: inline-block;
      background-position: bottom center;
      background-repeat: no-repeat;
      margin-right: 5px;
    }

    &__likes-counter {
      display: inline-block;

      &__image {
        @include image-style;
        background-image: url('~assets/images/lamp_off.svg');
        background-size: 8px 11px;

        &.active {
          background-image: url('~assets/images/lamp_on.svg');
          background-size: 14px 14px;
        }

        width: 14px;
        height: 14px;
      }

      &__label {
        @include label-style;
      }
    }

    &__counters {
      display: inline-block;
      width: 50%;
      text-align: left;
    }

    &__time {
      width: 50%;
      display: inline-block;
      text-align: right;
      @include label-style;
    }

    &__comments-counter {
      margin-left: 15px;
      display: inline-block;

      &__image {
        @include image-style;
        background-image: url('~assets/images/comment.svg');
        background-size: 14px 12px;
        width: 14px;
        height: 12px;
      }

      &__label {
        @include label-style;
      }
    }
  }
}
</style>
