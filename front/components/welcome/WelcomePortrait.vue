<template>
  <v-container class="fill-height mx-auto my-auto d-md-none d-lg-flex">
    <v-row v-show="params.title" align="center" no-gutters>
      <v-col>
        <h1 class="text-center">{{ params.title }}</h1>
      </v-col>
    </v-row>

    <v-row v-show="params.subTitle" align="center" no-gutters>
      <v-col>
        <h3 class="text-center">
          {{ params.subTitle }}
        </h3>
      </v-col>
    </v-row>

    <v-row align="center" no-gutters justify="center">
      <v-col lg="6" sm="12" class="text-center">
        <img :src="params.rightImage" alt="img" class="lead-img" />
      </v-col>
    </v-row>

    <v-row
      v-for="(bullet, index) in params.bulletPoints"
      :key="index"
      class="py-2"
      justify="center"
      no-gutters
    >
      <v-col lg="1" sm="1" cols="1" class="justify-center">
        <img :src="bullet.icon" alt="img" class="bullet-img flex" />
      </v-col>

      <v-col lg="5" sm="10" class="mx-2" cols="10">
        <h3>{{ bullet.text }}</h3>
      </v-col>
    </v-row>

    <v-row
      v-show="params.subSubTitle"
      no-gutters
      align="center"
      justify="center"
    >
      <v-col lg="6" md="12" sm="12">
        <h3 class="text-center">{{ params.subSubTitle }}</h3>
      </v-col>
    </v-row>

    <v-row align="center" no-gutters justify="center" class="mt-5">
      <v-col lg="6" sm="12" class="text-center">
        <v-btn dark large to="/auth/signup" class="col-12">Sign Up</v-btn>

        <nuxt-link
          class="inline-block link-highlight text-center mt-8"
          :to="{ name: 'auth-login' }"
        >
          Login
        </nuxt-link>
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
  name: 'WelcomePortrait',
  components: { SwipeFooter },
  props: {
    params: { type: Object, required: true },
    hideNextBtn: Boolean
  }
}
</script>
<style lang="scss" scoped>
@media (max-height: $screen-small-height) {
  .v-container {
    /* display: none !important;*/
  }
}

h1 {
  font-size: 1.3rem;
}

h3 {
  font-size: 0.9rem;
}

.link {
  cursor: pointer;
  text-decoration: none;
  color: black;
  display: block;
  align-items: center;
  @media (min-width: $screen-md-min) {
    padding: 1.1rem;
  }

  @media (max-width: $screen-sm-max) {
    flex-direction: column;
  }
}

.bullet-img {
  width: 24px;
  margin-right: 1rem;
  float: right;
}

.lead-img {
  max-width: 35vw;
  max-height: 35vw;
  padding-top: 0.3rem;
  padding-bottom: 0.3rem;
}
</style>
