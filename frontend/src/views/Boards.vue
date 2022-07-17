<template>
  <v-container fluid>
    <v-row dense>
      <v-col cols="3" v-if="loading">
        <v-skeleton-loader
          class="mx-auto"
          max-width="500"
          type="card"
        ></v-skeleton-loader>
      </v-col>
      <v-col cols="3" v-if="loading">
        <v-skeleton-loader
          class="mx-auto"
          max-width="500"
          type="card"
        ></v-skeleton-loader>
      </v-col>
      <v-col
        cols="3"
        v-for="board in boards"
        :key="board._id"
      >
        <v-card
          class="mx-auto"
          max-width="500"
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
      <v-col cols="3">
          <v-card class="mx-auto" max-width="500">
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
                  if-v="!board.isCreatePending"
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
