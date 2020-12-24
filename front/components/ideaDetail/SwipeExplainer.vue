<template>
  <swipable-card>
    <div class="d-flex fill-height align-center justify-center overflow-y-auto">
      <div class="m-auto text-center">
        <h1 class="text-h5 text-sm-h4 mb-2 mb-sm-4">
          Welcome to Daily Idea!
        </h1>

        <div class="mb-6">
          Welcome to the idea creating community{{
            $vuetify.breakpoint.mdAndUp ? ',' : '!'
          }}
          <div v-if="$vuetify.breakpoint.mdAndUp">
            introduce yourself in the comments!
          </div>
        </div>
        <div class="mb-6">
          <img
            v-if="$vuetify.breakpoint.mdAndUp"
            width="275"
            src="~assets/images/home/press-both-arrows-big.gif"
            alt="Arrows"
          />
          <img
            v-else
            width="202"
            src="~assets/images/home/swipeicon-both-big.gif"
            alt="Arrows"
          />
        </div>
        <div v-if="$vuetify.breakpoint.mdAndUp">
          Then get started exploring ideas, click on the right<br />
          arrow to see the next idea, and the left arrow to see the<br />
          previous one. Give it a try now!
        </div>
        <div v-else>
          Get started exploring ideas, swipe right<br />
          to see the next idea, and left to see the<br />
          previous one. Give it a try now!
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
