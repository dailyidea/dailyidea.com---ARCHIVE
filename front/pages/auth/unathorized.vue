<template>
  <card-layout>
    <div class="w-full text-center pt-10 pb-10">
      <div class="m-auto text-center">
        <img
          src="~assets/images/auth/unathorized.svg"
          width="592"
          height="376"
          alt="Unathorized"
          class="mb-5"
        />
        <h1 class="mb-5 heading">
          Oops you’re not logged in.
        </h1>
        <p>Let's help you out with that.</p>
        <nuxt-link
          class="d-inline-block link-highlight text-center"
          :to="{ name: 'auth-login' }"
        >
          log in or sign up
        </nuxt-link>
      </div>
    </div>
  </card-layout>
</template>

<script>
import CardLayout from '@/components/layout/CardLayout'

export default {
  components: {
    CardLayout
  }
}
</script>

<style lang="scss" scoped>
.heading {
  font-size: 30px;
  color: #4c4763;
}
</style>
