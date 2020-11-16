<template>
  <v-container class="fill-height mx-auto d-flex">
    <v-row>
      <v-col md="4" class="d-none d-md-flex d-lg-none justify-center">
        <img :src="params.rightImage" alt="img" class="graphic-left" />
      </v-col>

      <v-col md="8" sm="12" lg="12" class="pl-5 fill-height">
        <v-row
          v-show="params.title"
          no-gutters
          class="d-none d-md-flex d-lg-none"
        >
          <img src="~/assets/images/logo_text.png" alt="img" />
        </v-row>

        <v-row v-show="params.title" no-gutters>
          <v-col>
            <h1 class="text-center text-md-left text-lg-center">
              {{ params.title }}
            </h1>
          </v-col>
        </v-row>

        <v-row v-show="params.subTitle" no-gutters>
          <v-col>
            <h3 class="text-center text-md-left text-lg-center">
              {{ params.subTitle }}
            </h3>
          </v-col>
        </v-row>

        <v-row
          align="center"
          no-gutters
          justify="center"
          class="d-md-none d-lg-flex"
        >
          <v-col lg="6" sm="12" class="text-center">
            <img :src="params.rightImage" alt="img" class="lead-img" />
          </v-col>
        </v-row>

        <v-row
          v-for="(bullet, index) in params.bulletPoints"
          :key="index"
          class="py-2"
          no-gutters
          align="center"
          justify="center"
        >
          <v-col cols="1">
            <img :src="bullet.icon" alt="img" class="bullet-img flex" />
          </v-col>

          <v-col cols="10" lg="5" class="mx-2">
            <h3>{{ bullet.text }}</h3>
          </v-col>
        </v-row>

        <v-row v-show="params.subSubTitle" no-gutters>
          <v-col cols="12">
            <h3 class="text-center text-md-left text-lg-center">
              {{ params.subSubTitle }}
            </h3>
          </v-col>
        </v-row>

        <v-row align="center" no-gutters justify="center" class="mt-5">
          <v-col lg="6" sm="12" class="text-center">
            <v-btn color="primary" dark large to="/auth/signup" class="col-12"
              >Sign Up</v-btn
            >

            <nuxt-link
              class="d-inline-block link-highlight text-center my-2"
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
  name: 'WelcomeContent',
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
