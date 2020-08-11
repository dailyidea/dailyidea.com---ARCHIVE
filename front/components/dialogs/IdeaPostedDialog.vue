<template>
  <default-dialog
    :value="value"
    :image-path="require('~/assets/images/dialogs/idea_posted.svg')"
    @input="v => $emit('input', v)"
  >
    <h3 class="mb-4">
      Idea Posted!
    </h3>
    <p>
      You're well on your way to becoming an idea machine. Want to spark
      conversation and inspire others?
    </p>
    <v-divider></v-divider>
    <div class="d-flex justify-space-between">
      <div class="pt-5">Share your idea</div>
      <div class="py-4">
        <a href="#" @click.prevent="$emit('share')">
          <svg
            width="34"
            height="24"
            viewBox="0 0 34 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M21 21.5858V15H8.77151C6.53911 15 4.57717 16.4799 3.96389 18.6264L2.96152 22.1347C2.64296 23.2497 1 23.0196 1 21.8599V17C1 12.0294 5.02944 8 10 8H21V2.41421C21 1.52331 22.0771 1.07714 22.7071 1.70711L32.2929 11.2929C32.6834 11.6834 32.6834 12.3166 32.2929 12.7071L22.7071 22.2929C22.0771 22.9229 21 22.4767 21 21.5858Z"
              stroke="#5B41BB"
            />
          </svg>
        </a>
      </div>
    </div>
    <template v-slot:footer>&#8203;</template>
  </default-dialog>
</template>

<script>
import DefaultDialog from '@/components/dialogs/DefaultDialog'

export default {
  components: {
    DefaultDialog
  },

  props: {
    value: Boolean
  }
}
</script>

<style lang="scss" scoped>
::v-deep {
  .v-input--selection-controls {
    margin: 0;
  }
  .v-input--selection-controls:not(.v-input--hide-details) .v-input__slot {
    margin: 0;
  }
  .v-application--is-ltr .v-messages {
    display: none;
  }
}
</style>
