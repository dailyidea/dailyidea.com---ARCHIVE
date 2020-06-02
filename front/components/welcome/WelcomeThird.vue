<template>
  <welcome-card :left-arrow="true">
    <template v-slot:left>
      <div class="welcome-to text-center">Browse Other Ideas</div>
      <div class="bullet-point mt-10">
        <span class="bullet-point__bullet"></span>
        <span class="bullet-point__text">
          We'll show you ideas similar to your own, so you can get inspired
        </span>
      </div>
      <div class="bullet-point mt-3">
        <span class="bullet-point__bullet"></span>
        <span class="bullet-point__text">Discover the most popular ideas in your newsletter</span>
      </div>
      <div class="next-btn mt-10">
        <v-btn>Browse Ideas</v-btn>
      </div>
      <div class="next-btn mt-3">
        <v-btn>Write my own idea</v-btn>
      </div>
    </template>
    <template v-slot:right>
      <img src="~/assets/images/welcome/people-in-phones.png">
      <div class="right-column__right-text">
        Inspire your creativity by seeing what other people are thinking of.
      </div>
    </template>
  </welcome-card>
</template>
<script>
import WelcomeCard from './WelcomeCard'

export default {
  name: 'WelcomeThird',
  components: { WelcomeCard }
}
</script>
<style lang="scss" scoped>

.col { padding: 0; }
.row { margin: 0; }
.full-height { height: 100%; }

.left-column { 
  .explore-on-own {
    text-decoration: underline;
    color: $primary-color;
    font-size: 1.1rem;
    cursor: pointer;
    font-weight: 600;
  }

  .v-btn { 
    color: black !important; 
    font-weight: 600;
    font-size: 1.05rem;
    width: 40%;
    padding-top:1.8rem !important;
    padding-bottom:1.5rem !important;
  }

  .bullet-point {
    position: relative;
    margin: 0 auto;
    width: 60%;
    text-align: left;
    display: flex;

    &__bullet {
      display: inline-block;
      width: 19px;
      position: absolute;
      height: 19px;
      border-radius: 100%;
      border: 2px solid $color-muted-grey;
      margin-right: 1rem;
      margin-top: 0.25rem;
    }

    &__text {
      font-weight: 500;
      font-size: 1.2rem;
      margin-left: 2rem;
    }
  }

  .welcome-to {
    font-size: 2rem;
    font-weight: bold;
  }

  .daily { 
    color: $primary-color;
    font-size: 1.5rem;
    font-weight: bold;
  }

  .idea { 
    color: $secondary-color; 
    font-size: 1.5rem;
    font-weight: bold;
  }

}

.right-column {
  img {
    width: 50%;
  }

  &__right-text {
    font-size: 1.8rem;
    font-weight: 900;
    width: 85%;
    margin: 0 auto;
  }
}

</style>
