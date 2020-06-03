<template>
  <welcome-card @right-clicked="emitRightClicked" :right-arrow="true">
    <template v-slot:mobile-header>
      <div class="flex-column py-3">
        <div class="welcome-to">Welcome to</div>
        <div>
          <span class="daily"
            >DAILY</span
          ><span class="idea"
            >IDEA
          </span>
        </div>
      </div>
    </template>
    <template v-slot:left>
      <div class="hidden-mobile">
        <div class="welcome-to text-center">Welcome to</div>
        <span class="daily"
          >DAILY</span
        ><span class="idea"
          >IDEA
        </span>
      </div>
      <div class="d-flex flex-column justify-space-between mt-7">
        <div>
          <div class="bullet-point">
            <span class="bullet-point__bullet w-25"></span>
            <span class="bullet-point__text">Store your ideas so you remember and improve them over time</span>
          </div>
          <div class="bullet-point mt-3">
            <span class="bullet-point__bullet"></span>
            <span class="bullet-point__text">Browse other folks' ideas to inspire yourself further</span>
          </div>
        </div>
        <div>
          <div class="hidden-mobile">
            <v-btn @click="emitNext" class="py-5 my-5">Next</v-btn>
          </div>
          <div class="pb-5">
            <div class="explore-on-own" @click="emitMarkAsWelcomed">
              I'll explore on my own
            </div>
          </div>
        </div>
        <div></div>
      </div>
    </template>
    <template v-slot:right>
      <img src="~/assets/images/welcome/person-in-window.png">
      <div class="right-column__right-text pb-5">
        Everyday we will send you a simple reminder 
        to come up with a new idea.
      </div>
    </template>
  </welcome-card>
</template>
<script>
import WelcomeCard from './WelcomeCard'

export default {
  name: 'WelcomeFirst',
  components: { WelcomeCard },
  methods: {
    emitNext() {
      this.$emit('next')
    },
    emitMarkAsWelcomed() {
      this.$emit('mark-as-welcomed')
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
  }

  .bullet-point {
    position: relative;
    margin: 0 auto;
    width: 60%;

    @media only screen and (max-width: $screen-sm-max) {
      width: 90%;
    }

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

.right-column {
  img {
    width: 50%;    
  }

  &__right-text {
    font-size: 1.8rem;
    
    @media only screen and (max-width: $screen-sm-max) {
      font-size: 1.2rem;
    }

    font-weight: 900;
    width: 85%;
    margin: 0 auto;
  }
}

</style>
