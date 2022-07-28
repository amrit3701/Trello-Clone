<template>
  <v-container fluid>
    <v-row dense>
      <v-col
        xl="1" lg="2" md="3" sm="4" xs="6"
        v-show="loading"
        v-for="n in 2"
        :key="n"
      >
        <v-skeleton-loader
          v-bind="attrs"
          type="image, card-heading, button"
        ></v-skeleton-loader>
      </v-col>
      <v-col
        xl="1" lg="2" md="3" sm="4" xs="6"
        v-for="board in boards"
        :key="board._id"
      >
        <v-card
          class="mx-auto"
        >
          <v-img
            height="250"
            :src="board.background"
          ></v-img>
          <v-card-title>{{ board.name }}</v-card-title>
          <v-card-actions>
            <v-btn
              color="primary"
              text
              :to="{ name: 'board', params: {id: board._id} }"
            >
              Go
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
      <v-col xl="1" lg="2" md="3" sm="4" xs="6">
        <v-card class="mx-auto">
          <v-card-title class="text-h5">
            <div class="headline">Create Board</div>
          </v-card-title>
          <v-card-text class="text--primary">
            <div>
              <v-form
                ref="form"
                v-model="valid"
                @submit.prevent="createBoard"
                @keydown.prevent.enter
                v-if="!board.isCreatePending"
                >
                <v-text-field
                  v-model="board.name"
                  :rules="notEmptyRules"
                  label="name"
                  required
                ></v-text-field>
                <v-text-field
                  v-model="board.background"
                  :rules="notEmptyRules"
                  label="background"
                  required
                ></v-text-field>
                <v-btn
                  color="primary"
                  text
                  type="submit"
                  v-bind:disabled="!valid"
                >
                  Create
                </v-btn>
              </v-form>
                <v-progress-circular
                :size="50"
                color="primary"
                indeterminate
                v-if="board.isCreatePending"
                ></v-progress-circular>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>

import { mapState } from 'vuex';
import { models } from 'feathers-vuex';

export default {
  name: 'BoardsCmp',
  data: () => ({
    valid: false,
    notEmptyRules: [(v) => !!v || 'Cannot be empty'],
    attrs: {
      // class: 'mb-12',
      // boilerplate: true,
      elevation: 2,
    },
  }),
  created() {
    this.board = new this.Board();
    this.Board.find({ query: {} });
  },
  methods: {
    async createBoard() {
      if (this.valid) {
        await this.board.create();
        this.board = new this.Board();
        this.$refs.form.reset();
      }
    },
  },
  computed: {
    ...mapState('boards', {
      loading: 'isFindPending',
    }),
    Board: () => models.api.Board,
    boards: () => models.api.Board.findInStore().data,
  },
};
</script>
<style scoped>
>>> .v-skeleton-loader__button {
  margin: 10px;
}
>>> .v-skeleton-loader__image {
  height: 250px;
}
</style>
