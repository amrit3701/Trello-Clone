<template>
  <v-container fluid>
    <v-slide-y-transition>
      <v-layout column align-center>
        <v-form v-model="valid" @submit.prevent="signUp" @keydown.prevent.enter>
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
          <v-text-field
            v-model="user.confirmPassword"
            :rules="confirmPasswordRules"
            label="Confirm Password"
            type="password"
            required
          ></v-text-field>
          <v-btn type="submit" v-bind:disabled="!valid">SignUp</v-btn>
        </v-form>
        <v-progress-circular
          :size="50"
          color="primary"
          indeterminate
          v-if="isCreatePending"
        ></v-progress-circular>
      </v-layout>
    </v-slide-y-transition>
    <PopUpDialog
      :show-dialog="invalidSignUpDialog"
      title="Error"
      :description=errorMsg
      @updateDialogValue="invalidSignUpDialog = false"
    ></PopUpDialog>
  </v-container>
</template>

<script>
import { mapState } from 'vuex';
import { models } from 'feathers-vuex';

import PopUpDialog from '../components/PopUpDialog.vue';

export default {
  name: 'SignUp',
  components: {
    PopUpDialog,
  },
  data: (vm) => ({
    valid: false,
    invalidSignUpDialog: false,
    errorMsg: '',
    user: {
      username: '',
      password: '',
      confirmPassword: '',
    },
    notEmptyRules: [(v) => !!v || 'Cannot be empty'],
    confirmPasswordRules: [(confirmPassword) => confirmPassword === vm.user.password || 'Password must match'],
  }),
  computed: {
    User: () => models.api.User,
    ...mapState('users', ['isCreatePending']),
  },
  methods: {
    async signUp() {
      if (this.valid) {
        const user = new this.User(this.user);
        await user.create()
          .then(() => {
            this.$router.push('/login');
          }).catch((e) => {
            this.errorMsg = e.message;
            this.invalidSignUpDialog = true;
          });
      }
    },
  },
};
</script>
