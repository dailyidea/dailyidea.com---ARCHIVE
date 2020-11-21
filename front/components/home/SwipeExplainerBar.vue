<template>
  <div class="swipe-header justify-center py-2 d-sm-flex ">
    <v-card
      class="d-flex justify-space-between pa-2 col-md-6 col-sm-12 swipe-header-card"
    >
      <div style="width: 50px;">&nbsp;</div>
      <div class="pt-3">
        <span v-if="ideaIndex === 0">
          <span v-if="$vuetify.breakpoint.smAndDown"
            >Swipe left to see the next idea</span
          >
          <span v-else>Use arrow keys to see the next idea</span>
        </span>
        <span v-if="ideaIndex > 0">{{ ideaIndex + 1 }} of 3</span>
      </div>

      <div v-if="ideaIndex === 0" class="overflow-hidden">
        <div
          v-if="$vuetify.breakpoint.smAndDown"
          style="width: 72px; height: 39px; margin: 0 -5px 0 5px;"
        >
          <img
            src="~assets/images/home/swipeicon-left.gif"
            alt="Swipe left"
            style="width: 72px;"
          />
        </div>
        <div v-else style="width: 69px; height: 45px;">
          <img
            src="~assets/images/home/press-right-arrow.gif"
            alt="Swipe right"
            style="width: 66px; margin: 3px 0 0 3px;"
          />
        </div>
      </div>
      <div v-else>
        <div
          v-if="$vuetify.breakpoint.smAndDown"
          style="width: 72px; height: 39px; margin: 0 -5px 0 5px;"
        >
          <img
            src="~assets/images/home/swipeicon-both.gif"
            alt="Swipe"
            style="width: 72px;"
          />
        </div>
        <div v-else style="width: 69px; height: 45px;">
          <img
            src="~assets/images/home/press-both-arrows.gif"
            alt="Swipe right"
            style="width: 66px; margin: 3px 0 0 3px;"
          />
        </div>
      </div>
    </v-card>
  </div>
</template>

<script>
export default {
  props: {
    ideaIndex: { type: Number, required: true }
  }
}
</script>
