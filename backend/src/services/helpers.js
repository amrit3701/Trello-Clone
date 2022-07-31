const isBoardOwner = async context => {
  const boardId = context.params.query.boardId || context.data.boardId;
  if (!boardId) {
    return Promise.reject(new Error('boardID undefined'));
  }
  const { _id } = context.params.user._id;
  const boards = await context.app.service('boards');
  const board = await boards.get(boardId);

  if (board && board.ownerId.equals(_id)) {
    return context;
  } else {
    return Promise.reject(new Error('Un-Authorized'));
  }
};

const wait = () => {
  return new Promise(res => {
    setTimeout(() => res(), 2000);
  });
};

module.exports = {
  isBoardOwner, wait
};
