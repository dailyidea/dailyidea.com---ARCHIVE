<template>
  <card-layout>
    <div class="w-full text-center pt-10 pb-10">
      <div class="m-auto text-center">
        <img
          src="~assets/images/auth/unathorized-my-ideas.svg"
          width="592"
          height="270"
          alt="Unathorized"
          class="mb-5"
        />
        <h1 class="mb-5 heading">
          Oops you’re not logged in.
        </h1>
        <p>
          Save the best ideas on the internet to read later with an account.
        </p>
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
