<template>
  <v-container fluid>
    <v-slide-y-transition>
      <v-layout column align-center>
        <v-form v-model="valid" @submit.prevent="login" @keydown.prevent.enter>
          <v-text-field
            v-model="user.username"
            :rules="notEmptyRules"
            label="Username"
            required
          ></v-text-field>
          <v-text-field
            v-model="user.password"
            :rules="notEmptyRules"
            label="Password"
            type="password"
            required
          ></v-text-field>
          <v-btn type="submit" v-bind:disabled="!valid">LogIn</v-btn>
        </v-form>
      </v-layout>
    </v-slide-y-transition>
  </v-container>
</template>

<script>

import { mapActions } from 'vuex';

export default {
  name: 'LoginCmp',
  data: () => ({
    valid: false,
    user: {
      username: '',
      password: '',
    },
    notEmptyRules: [(v) => !!v || 'Cannot be empty'],
  }),
  computed: {
  },
  methods: {
    ...mapActions('auth', ['authenticate']),
    login() {
      if (this.valid) {
        this.authenticate({
          strategy: 'local',
          ...this.user,
        }).then(() => {
          console.log('Log IN');
          this.$router.push('/boards');
        }).catch((e) => {
          console.error('Authentication error', e);
        });
      }
    },
  },
};
</script>
