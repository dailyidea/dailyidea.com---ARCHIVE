<template>
  <v-container class="fill-height mx-auto d-none d-md-flex d-lg-none">
    <v-row no-gutters>
      <v-col cols="4" class="d-flex justify-center">
        <img :src="params.rightImage" alt="img" class="graphic-left" />
      </v-col>

      <v-col cols="8" class="pl-5 fill-height">
        <v-row v-show="params.title" no-gutters>
          <img src="~/assets/images/logo_text.png" alt="img" />
        </v-row>

        <v-row v-show="params.title" no-gutters>
          <v-col>
            <h1 class="">{{ params.title }}</h1>
          </v-col>
        </v-row>

        <v-row v-show="params.subTitle" no-gutters>
          <v-col>
            <h3 class="">
              {{ params.subTitle }}
            </h3>
          </v-col>
        </v-row>

        <v-row
          v-for="(bullet, index) in params.bulletPoints"
          :key="index"
          class="py-2"
          no-gutters
        >
          <v-col cols="1">
            <img :src="bullet.icon" alt="img" />
          </v-col>

          <v-col cols="10" class="mx-2">
            <h3>{{ bullet.text }}</h3>
          </v-col>
        </v-row>

        <v-row v-show="params.subSubTitle" no-gutters>
          <v-col cols="12">
            <h3 class="">{{ params.subSubTitle }}</h3>
          </v-col>
        </v-row>

        <v-row no-gutters>
          <v-col cols="12" class="">
            <v-btn dark large to="/auth/signup" class="col-4">Sign Up</v-btn>

            <nuxt-link
              class="inline-block link-highlight text-center my-2"
              :to="{ name: 'auth-login' }"
            >
              Login
            </nuxt-link>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <v-row v-if="params.footer" align="center" no-gutters justify="center">
      <swipe-footer></swipe-footer>
    </v-row>
  </v-container>
</template>
<script>
import SwipeFooter from '@/components/layout/SwipeFooter'

export default {
  name: 'WelcomeLandscape',
  components: { SwipeFooter },
  props: {
    hideNextBtn: Boolean,
    params: { type: Object, required: true }
  }
}
</script>
<style lang="scss" scoped>
.graphic-left {
  width: 100%;
}
</style>
