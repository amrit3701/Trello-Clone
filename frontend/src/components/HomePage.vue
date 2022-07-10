<template>
  <v-container>
    <v-layout column align-center>
        <v-btn :to="{ name: 'login' }">Go to SignUp</v-btn>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  name: 'HomePage',

  data: () => ({
  }),
};
</script>
