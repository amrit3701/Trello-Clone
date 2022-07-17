<template>
  <v-container fluid>
    <h2 v-if="board">{{ board.name }}</h2>
    <v-slide-y-transition mode="out-in">
      <v-layout row align-center wrap>
        <v-progress-circular
          :size="50"
          color="primary"
          indeterminate
          v-if="loadingBoard || loadingList"
        ></v-progress-circular>
        <v-col v-for="list in lists" :key="list._id">
          <v-card min-width="300">
            <v-card-title column style="flex-direction: column">
              <div class="headline">{{ list.name }}</div>
              <div>
                <ul v-if="cardsByListId[list._id]">
                  <li v-for="card in cardsByListId[list._id]" :key="card._id"> {{ card.title }}</li>
                </ul>
              </div>
            </v-card-title>
            <v-card-actions>
              <CardComponent :boardId="$route.params.id" :listId="list._id"></CardComponent>
            </v-card-actions>
          </v-card>
        </v-col>

        <v-col>
          <v-card min-width="300" max-width="300">
            <v-card-title column style="flex-direction: column">
              <div class="headline">Create List</div>
              <div>
                <v-form
                  ref="form"
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
        </v-col>
        <v-spacer></v-spacer>
      </v-layout>
    </v-slide-y-transition>
  </v-container>
</template>

<script>
import { mapState } from 'vuex';
import { models } from 'feathers-vuex';
import CardComponent from '../components/card.vue';

export default {
  name: 'BoardCmp',
  components: {
    CardComponent,
  },
  data: () => ({
    valid: false,
    notEmptyRules: [(v) => !!v || 'Cannot be empty'],
  }),
  created() {
    models.api.Board.get(this.$route.params.id);
    this.List.find({ query: { boardId: this.$route.params.id } });
    this.list = new this.List();

    this.Card.find({ query: { boardId: this.$route.params.id } });
  },
  methods: {
    async createList() {
      if (this.valid) {
        this.list.boardId = this.$route.params.id;
        await this.list.create();
        this.list = new this.List();
        this.$refs.form.reset();
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
    lists: (vm) => models.api.List.findInStore({ query: { boardId: vm.$route.params.id } }).data,
    List: () => models.api.List,
    board: (vm) => models.api.Board.getFromStore(vm.$route.params.id),
    Card: () => models.api.Card,
    cards: () => models.api.Card.findInStore().data,
    cardsByListId() {
      const byId = {};
      Object.values(this.cards).forEach((card) => {
        byId[card.listId] = byId[card.listId] || [];
        byId[card.listId].push(card);
      });
      return byId;
    },
  },
};
</script>
