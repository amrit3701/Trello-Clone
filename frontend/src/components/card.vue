<template>
  <v-row dense style="flex-direction: column">
    <v-card>
      <v-card-title column style="flex-direction: column">
        <div class="headline">Create Card</div>
        <div>
          <v-form
            ref="form"
            v-model="valid"
            @submit.prevent="createCard"
            @keydown.prevent.enter
            v-if="!card.isCreatePending"
            >
            <v-text-field
              v-model="card.title"
              :rules="notEmptyRules"
              label="name"
              required
            ></v-text-field>
            <v-btn type="submit" v-bind:disabled="!valid">Create</v-btn>
          </v-form>
          <v-progress-circular
          :size="50"
          color="primary"
          indeterminate
          v-if="card.isCreatePending"
          ></v-progress-circular>
        </div>
      </v-card-title>
    </v-card>
  </v-row>
</template>

<script>
import { models } from 'feathers-vuex';

export default {
  name: 'CardComponent',
  props: {
    boardId: String,
    listId: String,
    user: Object,
    createActivity: Function,
  },
  data: () => ({
    valid: false,
    notEmptyRules: [(v) => !!v || 'Cannot be empty'],
  }),
  created() {
    this.card = new this.Card();
  },
  computed: {
    Card: () => models.api.Card,
  },
  methods: {
    async createCard() {
      this.card.listId = this.listId;
      this.card.boardId = this.boardId;
      await this.card.create();
      this.createActivity(`**${this.user.user.username}** created **${this.card.title}** card`);
      this.card = new this.Card();
      this.$refs.form.reset();
    },
  },
};
</script>
