<template>
  <v-content>
    <v-container>
      <v-row>
        <v-col>
          <v-card class="full-height mx-auto" width="70%">
            <v-row justify="center" class="full-height">
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
  name: 'WelcomeCard'
}
</script>
<style lang="scss" scoped>
.right-column {
  background-color: $welcome-background-yellow;
  padding-top: 5rem;
  padding-bottom: 5rem;
}

.left-column {
  margin-top: 6%;
}
</style>
