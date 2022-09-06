const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:8080',
    defaultCommandTimeout: 5000,
    experimentalSessionAndOrigin: true,
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
  env: {
    serverUrl: 'http://localhost:3030',
  },
});
