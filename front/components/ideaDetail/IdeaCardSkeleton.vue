<template>
  <div class="idea-card-skeleton">
    <div ref="page" align="stretch" class="elevation-2 ma-1 card">
      <v-row>
        <v-col cols="11" md="8">
          <div class="placeholder"></div>
        </v-col>
      </v-row>
      <v-row class="mb-6">
        <v-col cols="2" md="1">
          <div class="placeholder-dot"></div>
        </v-col>
        <v-col cols="4" md="2">
          <div class="placeholder"></div>
        </v-col>
        <v-col cols="4" md="2">
          <div class="placeholder"></div>
        </v-col>
      </v-row>
      <v-row class="mb-10">
        <v-col cols="3" md="2">
          <div class="placeholder"></div>
        </v-col>
        <v-col cols="3" md="2">
          <div class="placeholder"></div>
        </v-col>
        <v-col cols="3" md="2">
          <div class="placeholder"></div>
        </v-col>
        <v-col cols="3" md="2">
          <div class="placeholder"></div>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="11" md="7">
          <div class="placeholder"></div>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="10" md="6">
          <div class="placeholder"></div>
        </v-col>
      </v-row>
      <v-row style="margin-top: 10rem;">
        <v-col cols="11" md="7">
          <div class="placeholder"></div>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script>
export default {
  //
}
</script>

<style lang="scss" scoped>
.idea-card-skeleton {
  display: flex;
  justify-content: center;
  position: relative;
  width: 100%;
}

.card {
  position: absolute;
  height: 70vh;
  width: calc(100% - 8px);
  padding: 1rem;
  background-color: white;
  border-radius: 8px;
  overflow: hidden;

  @media only screen and (min-width: $screen-md-min) {
    margin: 0 auto !important;
    margin-top: 2vh !important;
    width: 65vw;
    height: 80vh;
  }

  /* .rounded doesn't work because i'm applying this to a .row (which i shouldn't) */
}

.placeholder {
  width: 100%;
  height: 20px;
  background: #e3dfe9;
}

.placeholder-dot {
  width: 20px;
  height: 20px;
  background: #e3dfe9;
  border-radius: 100%;
}
</style>
