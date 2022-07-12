<template>
  <v-container fluid>
    <v-slide-y-transition mode="out-in">
      <v-layout row align-center wrap>
        <v-progress-circular
          :size="50"
          color="primary"
          indeterminate
          v-if="loading"
        ></v-progress-circular>
        <v-flex sm-3 v-for="board in boards" :key="board._id" pa-2>
          <v-card>
            <v-img
              height="300px"
              width="300px"
              :src="board.background"
            >
            </v-img>
            <v-card-title column style="flex-direction: column">
              <div class="headline">{{ board.name }}</div>
            </v-card-title>
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
        </v-flex>
        <v-flex sm-3 pa-2>
          <v-card>
            <v-card-title column style="flex-direction: column">
              <div class="headline">Create Board</div>
              <div>
                <v-form
                  v-model="valid"
                  @submit.prevent="createBoard"
                  @keydown.prevent.enter
                  if-v="!creating"
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
                  <v-btn type="submit" v-bind:disabled="!valid">Create</v-btn>
                </v-form>
                  <v-progress-circular
                  :size="50"
                  color="primary"
                  indeterminate
                  v-if="creating"
                  ></v-progress-circular>
              </div>
            </v-card-title>
          </v-card>
        </v-flex>
      </v-layout>
    </v-slide-y-transition>
  </v-container>
</template>

<script>

import { mapState } from 'vuex';

export default {
  name: 'BoardsCmp',
  data: () => ({
    valid: false,
    board: {
      name: '',
      background: '',
    },
    notEmptyRules: [(v) => !!v || 'Cannot be empty'],
  }),
  mounted() {
    const { Board } = this.$FeathersVuex.api;
    Board.find({ query: {} });
  },
  methods: {
    createBoard() {
      if (this.valid) {
        const { Board } = this.$FeathersVuex.api;
        const board = new Board(this.board);
        board.save();
        this.board = {
          name: '',
          background: '',
        };
      }
    },
  },
  computed: {
    ...mapState('boards', {
      loading: 'isFindingPending',
      creating: 'isCreatePending',
    }),
    boards() {
      const { Board } = this.$FeathersVuex.api;
      return Board.findInStore({ query: {} }).data;
    },
  },
};
</script>
