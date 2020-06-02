<template>
  <v-content>
    <v-container>
      <v-row>
        <v-col>
          <v-card class="full-height mx-auto card">
            <v-row justify="center" class="full-height">
              <div @click="emitLeftClicked" class="arrow left-arrow" v-show="leftArrow">
                <v-icon>mdi-arrow-left</v-icon>
              </div>
              <div @click="emitRightClicked" class="arrow right-arrow" v-show="rightArrow">
                <v-icon>mdi-arrow-right</v-icon>
              </div>

              <v-col class="text-center left-column">
                <slot name="left"></slot>
              </v-col>
              <v-col class="text-center right-column">
                <slot name="right"></slot>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-content>
</template>
<script>
export default {
  name: 'WelcomeCard',
  props: {
    leftArrow: Boolean,
    rightArrow: Boolean
  },
  methods: {
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
.row { margin: 0; }

.right-column {
  background-color: $welcome-background-yellow;
  padding-top: 5rem;
  padding-bottom: 5rem;
  border-radius: 0 5px 5px 0;
  position: relative;
}

.left-column {
  margin-top: 6%;
  position: relative;
}

.arrow {
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 50px;
  height: 50px;
  background-color: $welcome-arrow-background;
  border-radius: 100%;
  z-index: 200;
  top: 28vh;
  cursor: pointer;
}

.arrow .v-icon {
  color: white;
}

.arrow.right-arrow {
  right: -25px;
}

.arrow.left-arrow {
  left:-25px
}

.card {
  @media only screen and (min-width: $screen-md-min) and (max-width: $screen-md-max) {
  }
}
</style>
