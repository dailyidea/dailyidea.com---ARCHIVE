<template>
  <Layout>
    <card
      :additional-styling="{
        'min-height': '60vh',
        'max-width': isMobile ? '' : '60vw'
      }"
    >
      <div class="w-full text-center pt-10 pb-10">
        <div class="m-auto" style="max-width: 329px;">
          <img
            src="~assets/images/auth/unathorized.png"
            width="329"
            height="244"
            alt="Unathorized"
            class="mb-5"
          />
          <p class="mb-5">
            Oops, looks like you don’t have an account yet! Lets help you out
            with that.
          </p>
          <v-btn
            color="primary"
            rounded
            large
            to="/auth/signup"
            class="col-12 signup-button"
            >Sign Up</v-btn
          >
          <nuxt-link
            class="inline-block link-highlight text-lg text-center mt-6"
            :to="{ name: 'auth-login' }"
          >
            Login
          </nuxt-link>
        </div>
      </div>
      <div class="w-full">
        <swipe-footer />
      </div>
    </card>
  </Layout>
</template>

<script>
import Layout from '@/components/layout/Layout'
import Card from '@/components/shared/Card'
import SwipeFooter from '@/components/layout/SwipeFooter'

export default {
  components: {
    SwipeFooter,
    Card,
    Layout
  }
}
</script>

<style lang="scss" scoped>
.signup-button.v-btn.v-size--large {
  padding-top: 2px;
  font-size: 1.25rem;
  text-transform: none;
}
::v-deep {
  footer {
    padding-top: 10px;
  }

  .col.col-12 {
    padding: 3px 20px;
  }
}
</style>
