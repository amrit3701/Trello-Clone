<template>
  <v-container fluid>
    <h2 v-if="board">{{ board.name }}</h2>
    <v-slide-y-transition mode="out-in">
      <v-layout row wrap v-if="errorInList">
        <v-col>
          <v-alert dense outlined type="error">
            You are not authorized access this board.
          </v-alert>
        </v-col>
      </v-layout>
      <v-layout row wrap v-else-if="!errorInList">
        <v-progress-circular
          :size="50"
          color="primary"
          indeterminate
          v-if="loadingBoard || loadingList"
        ></v-progress-circular>
        <v-col v-for="list in lists" :key="list._id"
            :class="{ 'cyan lighten-5': droppingList == list }"
        >
          <v-card
            min-width="300"
            @dragover="setDroppingList($event, list)"
          >
            <v-toolbar color="cyan" dark>
              <v-toolbar-title>{{ list.name }}</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn icon>
                <v-icon>mdi-magnify</v-icon>
              </v-btn>
            </v-toolbar>
            <v-list one-line>
              <!-- <v-subheader></v-subheader> -->
                <div v-for="card in cardsByListId[list._id]" :key="card._id">
                  <v-list-item
                    draggable="true"
                    @dragend="dropCard(card)"
                  >
                    <v-list-item-content>
                      <v-list-item-title v-html="card.title">
                        {{ card.title }}
                      </v-list-item-title>
                      <v-list-item-subtitle v-html="card.description">
                        {{ card.description }}
                      </v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                  <v-divider
                  ></v-divider>
                </div>
            </v-list>
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
/* eslint-disable */
import { mapState } from 'vuex';
import { models } from 'feathers-vuex';
import CardComponent from '../components/card.vue';

export default {
  name: 'BoardCmp',
  components: {
    CardComponent,
  },
  data: () => ({
    droppingList: null,
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
    setDroppingList(event, list) {
      this.droppingList = list;
      event.preventDefault();
    },
    dropCard(card) {
      if (this.droppingList && this.droppingList._id != card.listId) {
        console.log("update");
        card.listId = this.droppingList._id;
        card.save();
      }
      this.droppingList = null;
    },
  },
  computed: {
    ...mapState('boards', {
      loadingBoard: 'isGetPending',
    }),
    ...mapState('lists', {
      loadingList: 'isFindPending',
      creatingList: 'isCreatePending',
      errorInList: 'errorOnFind',
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
