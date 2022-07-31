import feathersClient, { makeServicePlugin, BaseModel } from '../../feathers-client';

class Board extends BaseModel {
  // eslint-disable-next-line
  constructor(data, options) {
    super(data, options);
  }

  // Required for $FeathersVuex plugin to work after production transpile.
  static modelName = 'Board'

  // Define default properties here
  static instanceDefaults() {
    return {
      name: '',
      background: 'https://images.unsplash.com/photo-1658756418669-1d3af1172e9a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80',
    };
  }
}
const servicePath = 'boards';
const servicePlugin = makeServicePlugin({
  Model: Board,
  service: feathersClient.service(servicePath),
  servicePath,
});

// Setup the client-side Feathers hooks.
feathersClient.service(servicePath).hooks({
  before: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },
  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },
  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },
});

export default servicePlugin;
