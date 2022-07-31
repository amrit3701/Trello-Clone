<template>
  <v-container fluid>
    <div v-if="loadingBoard || loadingList">
      <v-progress-linear
        absolute
        indeterminate
        top
        color="secondary"
      ></v-progress-linear>
    </div>
    <div v-else>
      <v-layout row wrap v-if="!errorInList">
        <v-row class="ma-2 pa-2">
          <div class="text-h4" v-if="board">{{ board.name }}</div>
          <v-spacer></v-spacer>
          <div>
            <v-dialog
              model="false"
              width="600px"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-btn
                  text
                  class="text-decoration-none"
                  v-bind="attrs"
                  v-on="on"
                >
                  See Activities
                </v-btn>
              </template>
              <v-card>
                <v-card-title>
                  <span class="text-h5">Activities</span>
                </v-card-title>
              <v-card-text>
                <v-list three-line>
                  <template v-for="(activity, index) in activitiesByDate">
                    <v-list-item :key="activity._id">
                      <v-list-item-content>
                        <v-list-item-title v-html="markdownToHtml(activity.text)">
                        </v-list-item-title>
                        <v-list-item-subtitle
                          v-html="beautifyDate(activity.createdAt)"
                        ></v-list-item-subtitle>
                      </v-list-item-content>
                    </v-list-item>
                    <v-divider :key="index"></v-divider>
                  </template>
                </v-list>
              </v-card-text>
                </v-card>
            </v-dialog>
          </div>
        </v-row>
      </v-layout>
      <v-slide-y-transition mode="out-in">
        <v-layout row wrap v-if="errorInList">
          <v-col>
            <v-alert dense outlined type="error">
              You are not authorized access this board.
            </v-alert>
          </v-col>
        </v-layout>
        <v-layout row wrap v-if="!loadingList">
          <v-col xl="1" lg="2" md="3" sm="4" v-for="list in lists" :key="list._id">
            <v-card :disabled="list.isRemovePending"
              class="elevation-2"
              @dragover="setDroppingList($event, list)"
            >
              <v-progress-linear
                :active="list.isRemovePending || list.isUpdatePending"
                :indeterminate="list.isRemovePending || list.isUpdatePending"
                absolute
                top
                color="secondary"
              ></v-progress-linear>
              <v-toolbar height="80px" dark>
                <v-toolbar-title>
                  <v-text-field
                    v-model="list.name"
                    :label="list.name"
                    :rules="notEmptyRules"
                    solo
                    @change="updateListName(list)"
                  >
                  </v-text-field>
                </v-toolbar-title>
                <v-spacer></v-spacer>
                <v-btn icon @click="deleteList(list)">
                  <v-icon>{{ icon }}</v-icon>
                </v-btn>
              </v-toolbar>
              <v-list one-line>
                  <div
                    v-for="card in cardsByListId[list._id]"
                    :key="card._id"
                  >
                    <v-list-item
                      draggable="true"
                      @dragend="dropCard(card)"
                      :disabled="card.isRemovePending"
                    >
                      <v-list-item-content>
                        <v-list-item-title v-html="card.title">
                          {{ card.title }}
                        </v-list-item-title>
                        <v-list-item-subtitle v-html="card.description">
                          {{ card.description }}
                        </v-list-item-subtitle>
                      </v-list-item-content>
                      <v-list-item-action>
                        <v-btn icon @click="card.remove({query: {boardId: card.boardId}})">
                          <v-icon>{{ icon }}</v-icon>
                        </v-btn>
                      </v-list-item-action>
                    </v-list-item>
                    <v-divider
                    ></v-divider>
                  </div>
              </v-list>
              <v-card-actions>
                <CardComponent
                  :boardId="$route.params.id"
                  :listId="list._id"
                  :user="user"
                  :createActivity="createActivity"
                >
                </CardComponent>
              </v-card-actions>
            </v-card>
          </v-col>
          <v-col xl="1" lg="2" md="3" sm="4">
            <v-card class="elevation-2">
              <v-card-title column style="flex-direction: column">
                <div class="headline">Create List</div>
                <div>
                  <v-form
                    ref="form"
                    v-model="valid"
                    @submit.prevent="createList"
                    @keydown.prevent.enter
                    v-if="!creatingList"
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
    </div>
  </v-container>
</template>

<script>
/* eslint-disable */
import { mdiDeleteOutline } from '@mdi/js';
import { mapState, mapActions } from 'vuex';
import { models } from 'feathers-vuex';
import { marked } from 'marked';
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
    icon: mdiDeleteOutline,
  }),
  created() {
    this.list = new this.List();

    models.api.Board.get(this.$route.params.id);
    this.List.find({ query: { boardId: this.$route.params.id } });
    this.Card.find({ query: { boardId: this.$route.params.id } });
    this.Activity.find({ query: { boardId: this.$route.params.id } });
  },
  methods: {
    ...mapActions('lists', {removeList: 'remove'}),
    async createList() {
      if (this.valid) {
        this.list.boardId = this.$route.params.id;
        await this.list.create();
        this.createActivity(`**${this.user.user.username}** created **${this.list.name}** list`);
        this.list = new this.List();
        this.$refs.form.reset();
      }
    },
    setDroppingList(event, list) {
      this.droppingList = list;
      event.preventDefault();
    },
    dropCard(card) {
      if (this.droppingList && this.droppingList._id !== card.listId) {
        card.listId = this.droppingList._id;
        card.save();
        this.createActivity(`**${this.user.user.username}** moved **${card.title}** card to **${this.droppingList.name}**`);
      }
      this.droppingList = null;
    },
    createActivity(text) {
      const activity = new this.Activity();
      activity.text = text;
      activity.boardId = this.$route.params.id;
      activity.create();
    },
    markdownToHtml(markdownText) {
      return marked(markdownText);
    },
    beautifyDate(t) {
      const date = new Date();
      date.setTime(Date.parse(t));
      return date.toString();
    },
    updateListName(list) {
      if (list.name) {
        list.update();
      }
    },
    async deleteList(list) {
      const cardsInList = this.cardsByListId[list._id];
      const queryArgs = {query: {boardId: list.boardId}};
      if (cardsInList) {
        const isSure = confirm(
          'Are you sure?\nNote: list has cards, deleting list automatically deletes all list cards.'
        );
        if (isSure) {
          // No need to await for card to delete
          cardsInList.forEach((card) => card.remove(queryArgs));
          await list.remove(queryArgs);
        }
      } else {
        await list.remove(queryArgs);
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
      errorInList: 'errorOnFind',
    }),
    ...mapState('auth', { user: 'payload' }),
    List: () => models.api.List,
    Card: () => models.api.Card,
    Activity: () => models.api.Activity,
    lists: (vm) => vm.List.findInStore({ query: { boardId: vm.$route.params.id } }).data,
    board: (vm) => models.api.Board.getFromStore(vm.$route.params.id),
    cards: (vm) => vm.Card.findInStore().data,
    cardsByListId() {
      const byId = {};
      Object.values(this.cards).forEach((card) => {
        byId[card.listId] = byId[card.listId] || [];
        byId[card.listId].push(card);
      });
      return byId;
    },
    activities: (vm) => vm.Activity.findInStore(vm.$route.params.id).data,
    activitiesByDate() {
      return this.activities.slice().reverse();
    },
  },
};
</script>
<style scoped>
/*>>> .v-text-field>.v-input__control>.v-input__slot {*/
/*  background: none;*/
/*  box-shadow: none;*/
/*  color: pink;*/
/*}*/
</style>
