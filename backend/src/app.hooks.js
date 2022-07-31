// Application hooks that run for every service
const wait = require('./services/helpers');


module.exports = {
  before: {
    all: [],
    find: [wait],
    get: [],
    create: [wait],
    update: [wait],
    patch: [],
    remove: [wait]
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};
