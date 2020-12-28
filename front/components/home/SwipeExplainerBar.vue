<template>
  <div class="swipe-header justify-center py-2 d-flex d-sm-none">
    <v-card
      class="d-flex justify-center align-center pa-2 col-md-6 col-sm-12 swipe-header-card"
    >
      <div
        class="pt-2 pb-1 pl-2 flex-grow-1 text-no-wrap text-center text-light-grey"
        style="margin-left:72px;"
      >
        <!-- 72px offset against the swipe icon on the right-->
        <span v-if="ideaIndex === 0">
          <span v-if="$vuetify.breakpoint.smAndDown" class="align-center"
            >Swipe left</span
          >
          <span v-else>Use arrow keys to see the next idea</span>
          <!-- TODO: probably not used anymore -->
        </span>
        <span v-if="ideaIndex > 0">{{ ideaIndex + 1 }} of 3</span>
      </div>

      <div
        v-if="ideaIndex === 0"
        class="overflow-hidden flex-grow-0 align-self-end"
      >
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
      <div v-else class="flex-grow-0 align-self-end">
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

<style scoped>
.text-light-grey {
  color: #acabb2;
}
</style>
