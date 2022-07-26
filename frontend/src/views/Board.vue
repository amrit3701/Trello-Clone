<template>
  <v-container fluid>
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
                      <v-list-item-title v-html="markdownToHtml(activity.text)"></v-list-item-title>
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
      <v-layout row wrap v-else-if="!errorInList">
        <v-progress-circular
          :size="50"
          color="primary"
          indeterminate
          v-if="loadingBoard || loadingList"
        ></v-progress-circular>
        <v-col xl="1" lg="2" md="3" sm="4" v-for="list in lists" :key="list._id"
            :class="{ 'cyan lighten-5': droppingList == list }"
        >
          <v-card
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
          <v-card>
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

  }),
  created() {
    models.api.Board.get(this.$route.params.id);
    this.List.find({ query: { boardId: this.$route.params.id } });
    this.list = new this.List();

    this.Card.find({ query: { boardId: this.$route.params.id } });
    this.Activity.find({ query: { boardId: this.$route.params.id } });
  },
  methods: {
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
