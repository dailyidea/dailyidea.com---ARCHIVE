<template>
  <welcome-card @left-clicked="emitLeftClicked" @right-clicked="emitRightClicked" :left-arrow="true" :right-arrow="true">
    <template v-slot:left>
      <div class="welcome-to text-center">Save Your Ideas</div>
      <div class="bullet-point mt-10">
        <span class="bullet-point__bullet w-25"></span>
        <span class="bullet-point__text">
          Overflowing with ideas? Log them here. We'll remind you about your best ideas and 
          show similar ideas that will spark your creativity.
        </span>
      </div>
      <div class="bullet-point mt-3">
        <span class="bullet-point__bullet"></span>
        <span class="bullet-point__text">
          Only a few ideas? This will help you exercise your idea muscle. 
          With practice you'll become an idea machine!
        </span>
      </div>
      <div class="next-btn mt-10">
        <v-btn @click="emitNext">Next</v-btn>
      </div>
      <div class="mt-5">
        <div class="explore-on-own" @click="emitMarkAsWelcomed">
          I'll explore on my own
        </div>
      </div>
    </template>
    <template v-slot:right>
      <img src="~/assets/images/welcome/person-with-letter.png">
      <div class="right-column__right-text">
        Just respond to the daily email and we'll automatically save your ideas for you.
      </div>
    </template>
  </welcome-card>
</template>
<script>
import WelcomeCard from './WelcomeCard'

export default {
  name: 'WelcomeSecond',
  components: { WelcomeCard },
  methods: {
    emitNext() {
      this.$emit('next')
    },
    emitMarkAsWelcomed() {
      this.$emit('mark-as-welcomed')
    },
    emitLeftClicked() {
      this.$emit('left-clicked')
    },
    emitRightClicked() {
      this.$emit('right-clicked')
    }
  }
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
    width: 30%;
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
    width: 60%;
  }

  &__right-text {
    font-size: 1.8rem;
    font-weight: 900;
    width: 85%;
    margin: 0 auto;
  }
}

</style>
