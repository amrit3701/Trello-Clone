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
      </v-layout>
    </v-slide-y-transition>
  </v-container>
</template>

<script>
export default {
  name: 'SignUp',
  data: (vm) => ({
    valid: false,
    user: {
      username: '',
      password: '',
      confirmPassword: '',
    },
    notEmptyRules: [(v) => !!v || 'Cannot be empty'],
    confirmPasswordRules: [(confirmPassword) => confirmPassword === vm.user.password || 'Password must match'],
  }),
  methods: {
    signUp() {
      if (this.valid) {
        const { User } = this.$FeathersVuex.api;
        const user = new User(this.user);
        console.log(user);
        user.create()
          .then((us) => {
            console.log(us);
            this.$router.push('/login');
          });
        console.log('the form is valid');
      }
    },
  },
};
</script>
