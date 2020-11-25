<template>
  <div class="page-inner fill-height">
    <div
      v-if="page === 0"
      class="d-flex flex-column py-3 text-center justify-space-between fill-height"
    >
      <h1 class="heading mb-1 font-weight-regular">
        Every Day, Log an Idea
      </h1>
      <p class="mb-2">
        A project idea, a startup idea,<br />
        a work idea.
      </p>
      <img
        class="image1 mb-3"
        src="~assets/images/welcome2/graphic1.svg"
        alt=""
      />
      <p class="mb-3">
        Practice generating ideas to become<br />
        an idea machine.
      </p>
      <p class="mb-4">
        <v-btn
          class="button text-decoration-none"
          color="primary"
          dark
          large
          :min-width="250"
          to="/auth/signup"
          >Sign Up</v-btn
        >
      </p>
      <p>
        <nuxt-link
          class="d-inline-block link-highlight text-lg"
          to="/auth/login"
        >
          Login
        </nuxt-link>
      </p>
    </div>
    <div
      v-if="page === 1"
      class="d-flex flex-column py-3 text-center justify-space-between fill-height"
    >
      <h1 class="heading mb-1 font-weight-regular">
        Browse Popular Ideas
      </h1>
      <p class="mb-2">
        Explore other ideas to inspire<br />
        your own creativity
      </p>
      <img
        class="image2 mb-4"
        src="~assets/images/welcome2/graphic2.svg"
        alt=""
      />
      <p class="mb-4">
        <v-btn
          class="button text-decoration-none"
          color="primary"
          dark
          large
          :min-width="250"
          to="/auth/signup"
          >Sign Up</v-btn
        >
      </p>
      <p>
        <nuxt-link
          class="d-inline-block link-highlight text-lg"
          to="/auth/login"
        >
          Login
        </nuxt-link>
      </p>
    </div>
    <div
      v-if="page === 2"
      class="d-flex flex-column py-3 text-center justify-space-between fill-height"
    >
      <h1 class="heading mb-3 font-weight-regular">
        How Does it Work?
      </h1>
      <img
        class="image3 mb-4"
        src="~assets/images/welcome2/graphic3.svg"
        alt=""
      />
      <div class="d-flex align-start">
        <img
          src="~assets/images/welcome2/mail.svg"
          alt="img"
          class="mr-4 mt-1"
        />
        <p class="text-left">
          We’ll send you an email to remind<br />
          you to submit an idea.
        </p>
      </div>
      <div class="d-flex align-start">
        <img
          src="~assets/images/welcome2/send.svg"
          alt="img"
          class="mr-4 mt-1"
        />
        <p class="text-left">
          You just respond to the email with<br />
          an idea and we store it for you.
        </p>
      </div>
      <p class="mb-4">
        <v-btn
          class="button text-decoration-none"
          color="primary"
          dark
          large
          :min-width="250"
          to="/auth/signup"
          >Sign Up</v-btn
        >
      </p>
      <p>
        <nuxt-link
          class="d-inline-block link-highlight text-lg"
          to="/auth/login"
        >
          Login
        </nuxt-link>
      </p>
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
  max-height: 550px;
}
.heading {
  font-size: 1.75rem;
}
.image1 {
  height: 105px;
}
.image2 {
  height: 180px;
}
.image3 {
  height: 180px;
}
.button {
  font-size: 1.25rem;
}

@media (min-width: $screen-md-min) {
  .page-inner {
    font-size: 1.25rem;
    max-height: 700px;
  }
  .heading {
    font-size: 3rem;
  }
  .image1 {
    height: 200px;
  }
  .image2 {
    height: 270px;
  }
  .image3 {
    height: 141px;
  }
}
</style>
