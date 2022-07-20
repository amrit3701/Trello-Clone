const { authenticate } = require('@feathersjs/authentication').hooks;

const isBoardOwner = async (context) => {
  const { boardId } = context.params.query;
  const { _id } = context.params.user._id;

  const boards = await context.app.service('boards');
  const board = await boards.get(boardId);

  if (board && board.ownerId.equals(_id)) {
    return context
  } else {
    return Promise.reject(new Error('Un-Authorized'));
  }
};

module.exports = {
  before: {
    all: [ authenticate('jwt') ],
    find: [ isBoardOwner ],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
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
