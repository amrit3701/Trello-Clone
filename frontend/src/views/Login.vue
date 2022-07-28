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
          <v-btn type="submit" v-bind:disabled="!valid || isAuthenticatePending">LogIn</v-btn>
        </v-form>
        <v-progress-circular
          :size="50"
          color="primary"
          indeterminate
          v-if="isAuthenticatePending"
        ></v-progress-circular>
      </v-layout>
    </v-slide-y-transition>
    <PopUpDialog
      :show-dialog="invalidLoginDialog"
      title="Authentication Error"
      description="Invalid credentials"
      @updateDialogValue="invalidLoginDialog = false"
    ></PopUpDialog>
  </v-container>
</template>

<script>

import { mapState, mapActions } from 'vuex';

import PopUpDialog from '../components/PopUpDialog.vue';

export default {
  name: 'LoginCmp',
  components: {
    PopUpDialog,
  },
  data: () => ({
    valid: false,
    invalidLoginDialog: false,
    user: {
      username: '',
      password: '',
    },
    notEmptyRules: [(v) => !!v || 'Cannot be empty'],
  }),
  computed: {
    ...mapState('auth', ['isAuthenticatePending']),
  },
  methods: {
    ...mapActions('auth', ['authenticate']),
    async login() {
      if (this.valid) {
        await this.authenticate({
          strategy: 'local',
          ...this.user,
        }).then(() => {
          this.$router.push('/boards');
        }).catch((e) => {
          this.invalidLoginDialog = true;
          console.error('Authentication error', e);
        });
      }
    },
  },
};
</script>
