<template>
  <button :class="classes" :disabled="disabled">
    <slot></slot>
  </button>
</template>
<script>
export default {
  name: 'IdeaBtn',
  props: {
    fixedWidth: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    classes() {
      return {
        'idea-btn': true,
        'fixed-width': this.fixedWidth
      }
    }
  }
}
</script>
<style scoped lang="scss">
$font-stack: Avenir LT Std;

.idea-btn {
  background-color: rgba(91, 65, 187, 1);
  width: 131px;
  height: 36px;
  border-radius: 6px;
  padding: 11px 24px;
  color: rgba(251, 251, 253, 1);
  font-size: 16px;
  font-family: $font-stack;

  &:hover {
    height: 46px;
  }

  &:focus {
    height: 46px;
    background-color: rgba(66, 39, 169, 1);
  }

  &:disabled {
    background-color: rgba(91, 65, 187, 0.6);
  }

  &.fixed-width {
    width: 311px;
  }
}
</style>
