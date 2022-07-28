<template>
  <v-layout row class="justify-center">
    <v-col xl="2" lg="4" md="6" sm="10" xs="12">
      <v-card
        class="mx-auto my-12"
        style="box-shadow: none"
      >
        <div class="text-h1 text-center">404</div>
        <v-card-text class="text-center text-h6">Ooops! You found me!</v-card-text>
        <v-divider class="mx-2"></v-divider>
        <v-card-text class="text-center">That page doesn't exist or is unavailable.</v-card-text>
        <v-card-actions class="justify-center">
          <div class="text-center">
            <v-btn
              rounded
              color="primary"
              text
              :to="{ name: 'home' }"
            >
              Go back to Home
            </v-btn>
          </div>
        </v-card-actions>
      </v-card>
    </v-col>
  </v-layout>
</template>

<script>
export default {
  name: 'PageNotFound',
};
</script>
