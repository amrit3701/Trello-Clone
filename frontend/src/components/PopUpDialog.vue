<template>
  <div class="text-center">
    <v-dialog
      v-model="dialog"
      max-width="290"
    >
      <v-card>
        <v-card-title class="text-h6 lighten-2">
          <v-icon x-large>{{ icon }}</v-icon>
          {{ title }}
        </v-card-title>

        <v-card-text>
          {{ description }}
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="secondary"
            text
            @click="dialog = false"
          >
            Ok
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mdiAlertCircleOutline } from '@mdi/js';

export default {
  name: 'PopUpDialog',
  props: {
    showDialog: Boolean,
    title: String,
    description: String,
    icon: { type: String, default: mdiAlertCircleOutline },
  },
  data: () => ({
  }),
  computed: {
    dialog: {
      get() {
        return this.showDialog;
      },
      set(val) {
        this.$emit('updateDialogValue', val);
      }
      ,
    },
  },
};
</script>

<style scoped>

</style>
