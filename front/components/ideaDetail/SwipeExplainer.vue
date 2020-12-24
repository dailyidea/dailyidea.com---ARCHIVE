<template>
  <swipable-card>
    <div class="d-flex fill-height align-center justify-center overflow-y-auto">
      <div class="m-auto text-center">
        <h1 class="text-h5 text-sm-h4 mb-2 mb-sm-4">
          Welcome to Daily Idea!
        </h1>
        <div class="my-6">
          <img
            v-if="$vuetify.breakpoint.mdAndUp"
            width="175"
            src="~assets/images/home/press-both-arrows-big.gif"
            alt="Arrows"
          />
          <img
            v-else
            width="125"
            src="~assets/images/home/swipeicon-both-big.gif"
            alt="Arrows"
          />
        </div>
        <div v-if="$vuetify.breakpoint.mdAndUp">
          Use your arrow keys to start exploring ideas!
        </div>
        <div v-else>
          Swipe to start exploring ideas!
        </div>
      </div>
    </div>
  </swipable-card>
</template>

<script>
import SwipableCard from '@/components/shared/SwipableCard'

export default {
  components: { SwipableCard },

  props: {
    additionalStyling: { type: Object, default: Object }
  },

  data() {
    return { isExpandedState: false }
  },

  computed: {
    isExpanded: {
      set(state) {
        this.$emit('toggle-expand', state)
        this.isExpandedState = state
      },

      get() {
        if (this.expanded) {
          return true
        }

        return this.isMobile ? this.isExpandedState : true
      }
    }
  },

  methods: {
    //
  }
}
</script>
