<template>
  <v-container fluid>
    <v-slide-y-transition mode="out-in">
      <v-layout row align-center wrap>
        <v-progress-circular
          :size="50"
          color="primary"
          indeterminate
          v-if="loadingBoard || loadingList"
        ></v-progress-circular>
        <v-flex xs12>
          <h2 v-if="board">{{ board.name }}</h2>
        </v-flex>
        <v-flex sm-3 v-for="list in lists" :key="list._id" pa-2>
          <v-card>
            <v-card-title column style="flex-direction: column">
              <div class="headline">{{ list.name }}</div>
            </v-card-title>
          </v-card>
        </v-flex>

        <v-flex sm-3 pa-2>
          <v-card>
            <v-card-title column style="flex-direction: column">
              <div class="headline">Create List</div>
              <div>
                <v-form
                  v-model="valid"
                  @submit.prevent="createList"
                  @keydown.prevent.enter
                  if-v="!creatingList"
                  >
                  <v-text-field
                    v-model="list.name"
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
                  v-if="creatingList"
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
  name: 'BoardCmp',
  data: () => ({
    valid: false,
    board: {},
    list: {
      name: '',
      boardId: '',
      order: 0,
      archived: false,
    },
    notEmptyRules: [(v) => !!v || 'Cannot be empty'],
  }),
  mounted() {
    const { List } = this.$FeathersVuex.api;
    List.find({ query: { boardId: this.$route.params.id } });
  },
  methods: {
    createList() {
      if (this.valid) {
        const { List } = this.$FeathersVuex.api;
        this.list.boardId = this.$route.params.id;
        const list = new List(this.list);
        list.save();
        this.list = {
          name: '',
          boardId: '',
          order: 0,
          archived: false,
        };
      }
    },
  },
  computed: {
    ...mapState('boards', {
      loadingBoard: 'isGetPending',
    }),
    ...mapState('lists', {
      loadingList: 'isFindPending',
      creatingList: 'isCreatePending',
    }),
    lists() {
      const { List } = this.$FeathersVuex.api;
      return List.findInStore({
        query: {
          boardId: this.$route.params.id,
        },
      }).data;
    },
  },
};
</script>
