<template>
  <v-row no-gutters class="auth-page" hidden>
    <v-col cols="0" md="4" class="auth-page__left ">
      <img
        src="~/assets/images/bigTree.png"
        class="auth-page__left__tree hidden-sm-and-down"
        alt=""
      />
      <img
        src="~/assets/images/person_with_phone.png"
        class="auth-page__left__man-with-phone hidden-sm-and-down"
        alt=""
      />
    </v-col>
    <v-col cols="12" md="4" class="auth-page__content">
      <v-icon class="auth-page__go-back-icon hidden-md-and-up" @click="goBack()"
        >fas fa-times</v-icon
      >

      <div class="auth-page__content__header">
        <div class="auth-page__content__header__lamp-image-container">
          <div
            class="auth-page__content__header__lamp-image-container__image-wrapper"
          >
            <img
              v-if="lampOn"
              class="auth-page__content__header__lamp-image-container__image-wrapper__image"
              src="~/assets/images/verify/lamp-active-large.png"
              alt=""
            />
            <img
              v-else
              class="auth-page__content__header__lamp-image-container__image-wrapper__image"
              src="~/assets/images/verify/lamp-inactive-large.png"
              alt=""
            />
          </div>
        </div>
        <div class="auth-page__content__header__logo-image-container">
          <img
            class="auth-page__content__header__logo-image-container__image"
            src="~/assets/images/logo_text.svg"
          />
        </div>
      </div>
      <div class="auth-page__content__content">
        <slot></slot>
      </div>
    </v-col>
    <v-col cols="0" md="4" class="auth-page__right">
      <v-icon class="auth-page__go-back-icon" @click="goBack()"
        >fas fa-times</v-icon
      >
      <img
        src="~/assets/images/smallTree.png"
        class="auth-page__right__tree  hidden-sm-and-down"
        alt=""
      />
      <img
        src="~/assets/images/signup/lady_with_phone.png"
        class="auth-page__right__woman-with-phone  hidden-sm-and-down"
        alt=""
      />
    </v-col>
  </v-row>
</template>

<script>
export default {
  name: 'AuthPage',
  props: {
    lampOn: { type: Boolean, default: false }
  },

  computed: {},
  mounted() {
    this.$el.removeAttribute('hidden')
  },

  methods: {
    goBack() {
      window.history.back()
    }
  }
}
</script>

<style scoped lang="scss">
.auth-page {
  background-image: url(~assets/images/signup/footer_background.png);
  background-size: 100% auto;
  background-position: 50% 120%;
  background-repeat: no-repeat;

  &__go-back-icon {
    position: absolute;
    right: 0.5rem;
    top: 0.5rem;
    color: $color-muted-grey;
  }

  &__content {
    position: relative;
    @media (min-width: $screen-md-min) {
      flex: 0 0 33vw;
      min-width: 500px;
    }

    &__header {
      margin-top: 10vh;

      &__lamp-image-container {
        position: relative;
        height: 110px;

        &__image-wrapper {
          position: absolute;
          width: 100%;
          height: 100%;
          transition: opacity 0.3s ease;

          &__image {
            height: 100%;
            width: auto;
            display: block;
            margin: auto;
            padding-top: 2rem;
          }
        }
      }

      &__logo-image-container {
        margin-top: 10px;
        text-align: center;

        &__image {
          display: inline-block;
          padding-top: 1rem;
          width: 200px;
        }
      }
    }

    &__content {
    }
  }

  &__left {
    flex: 1;
    position: relative;
    overflow: visible;

    &__tree {
      height: 75vh;
      position: absolute;
      left: -3%;
      top: 20vh;
    }

    &__man-with-phone {
      height: 75vh;
      position: absolute;
      right: 10%;
      bottom: 3vh;
    }
  }

  &__right {
    flex: 1;
    position: relative;
    overflow: hidden;

    &__tree {
      height: 90vh;
      position: absolute;
      left: 58%;
      bottom: 6vh;
    }

    &__woman-with-phone {
      height: 72vh;
      position: absolute;
      left: 20%;
      bottom: 3vh;
    }
  }
}
</style>
