<template>
  <v-app>
    <v-app-bar app>
      <v-toolbar-title>Trello Clone</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items v-if="!user">
        <v-btn text :to="{ name: 'signup' }">SignUp</v-btn>
        <v-btn text :to="{ name: 'login' }">Login</v-btn>
      </v-toolbar-items>
      <v-toolbar-items v-if="user">
        <v-btn
          text
        >{{ user.user.username }}
        </v-btn>
        <v-btn text @click="logout">Logout</v-btn>
      </v-toolbar-items>
    </v-app-bar>
    <v-main>
      <router-view/>
    </v-main>
  </v-app>
</template>

<script>

import { mapActions, mapState } from 'vuex';

export default {
  name: 'App',

  data: () => ({
    //
  }),
  mounted() {
    this.authenticate().then(() => {
      this.$router.push('/boards');
    }).catch((e) => {
      console.error('Authentication error', e);
    });
  },
  computed: {
    ...mapState('auth', { user: 'payload' }),
  },
  methods: {
    ...mapActions('auth', ['authenticate']),
    ...mapActions('auth', { authLogout: 'logout' }),
    logout() {
      this.authLogout().then(() => this.$router.push('/login'));
    },
  },
};
</script>
