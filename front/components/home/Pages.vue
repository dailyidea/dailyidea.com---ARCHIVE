<template>
  <div class="page-inner fill-height fill-width">
    <div
      v-if="page === 0"
      class="d-flex py-1 py-sm-6 justify-space-between fill-height fill-width"
    >
      <div
        class="absolute inset-0 d-none d-sm-flex justify-center align-center overflow-hidden"
      >
        <img
          src="~assets/images/home/page1.gif"
          style="width: 100%;"
          alt="Lamp"
        />
      </div>

      <div class="left-col text-center text-sm-left">
        <h1 class="heading text-h5 text-sm-h4 mb-2 mb-sm-4">
          Become An<br />
          Idea Machine
        </h1>
        <p class="mb-0 mb-sm-8">
          Bring ideas to life,<br />
          in a few minutes each day.
        </p>
        <div class="d-sm-none" style="margin: 0 -2rem;">
          <img
            src="~assets/images/home/page1.gif"
            style="width: 100%;"
            alt="Lamp"
          />
        </div>
        <v-btn
          class="button text-decoration-none d-block d-sm-inline-block mb-3"
          color="primary"
          dark
          large
          to="/ideas-cards"
          >Get Started</v-btn
        >
      </div>
      <div
        class="d-none d-sm-block align-self-end text-body-2"
        style="color: #9794A4;"
      >
        <img
          src="~assets/images/home/press-right-arrow.gif"
          alt="Swipe right"
          class="align-middle ml-3"
          style="width: 66px;"
        />
      </div>
    </div>
    <div
      v-if="page === 1"
      class="d-flex py-1 py-sm-6 justify-space-between fill-height fill-width"
    >
      <div
        class="absolute inset-0 d-none d-sm-flex justify-center align-center"
      >
        <img
          src="~assets/images/home/page2.gif"
          style="width: 100%;"
          alt="Lamp"
        />
      </div>

      <div class="left-col text-center text-sm-left">
        <h1 class="heading text-h5 text-sm-h4 mb-2 mb-sm-4">
          Explore Ideas
        </h1>
        <p class="mb-0 mb-sm-8">
          Get inspired.<br />
          Boost your creativity.
        </p>
        <div class="d-sm-none" style="margin: 0 -2rem;">
          <img
            src="~assets/images/home/page2.gif"
            style="width: 100%;"
            alt="Lamp"
          />
        </div>
        <v-btn
          class="button text-decoration-none d-block d-sm-inline-block mb-3"
          color="primary"
          dark
          large
          to="/ideas-cards"
          >Get Started</v-btn
        >
      </div>
      <div
        class="d-none d-sm-block align-self-end text-body-2"
        style="color: #9794A4;"
      >
        <img
          src="~assets/images/home/press-right-arrow.gif"
          alt="Swipe right"
          class="align-middle ml-3"
          style="width: 66px;"
        />
      </div>
    </div>
    <div
      v-if="page === 2"
      class="d-flex py-1 py-sm-6 justify-space-between fill-height fill-width"
    >
      <div
        class="absolute inset-0 d-none d-sm-flex justify-center align-center"
      >
        <img
          src="~assets/images/home/page3.gif"
          style="width: 100%;"
          alt="Lamp"
        />
      </div>

      <div class="left-col text-center text-sm-left">
        <h1 class="heading text-h5 text-sm-h4 mb-2 mb-sm-4">
          Every Day,<br />
          Log An Idea
        </h1>
        <p class="mb-0 mb-sm-8">
          A project idea,<br />
          a startup idea, a work idea.
        </p>
        <div class="d-sm-none" style="margin: 0 -2rem;">
          <img
            src="~assets/images/home/page3.gif"
            style="width: 100%;"
            alt="Lamp"
          />
        </div>
        <v-btn
          class="button text-decoration-none d-block d-sm-inline-block mb-3"
          color="primary"
          dark
          large
          to="/ideas-cards"
          >Get Started</v-btn
        >
      </div>
      <div
        class="d-none d-sm-block align-self-end text-body-2"
        style="color: #9794A4;"
      >
        <img
          src="~assets/images/home/press-right-arrow.gif"
          alt="Swipe right"
          class="align-middle ml-3"
          style="width: 66px;"
        />
      </div>
    </div>
    <div
      v-if="page === 3"
      class="d-flex py-1 py-sm-6 justify-space-between fill-height fill-width"
    >
      <div
        class="d-flex fill-width fill-height align-center justify-center overflow-y-auto"
      >
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
    </div>
  </div>
</template>

<script>
export default {
  props: {
    page: { type: Number, required: true }
  }
}
</script>

<style lang="scss" scoped>
.page-inner {
  padding: 2rem;
}

.button {
  font-size: 1.25rem;
}

@media (min-width: $screen-md-min) {
  .page-inner {
    padding: 2rem 4rem;
    font-size: 1.25rem;
  }
  .col-left {
    max-width: calc(50% - 100px);
  }
  .heading {
  }
}
</style>
