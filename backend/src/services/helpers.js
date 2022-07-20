const isBoardOwner = async (context) => {
  console.log(context); 
  const boardId = context.params.query.boardId || context.data.boardId;
  if (!boardId) {
    return Promise.reject(new Error('boardID undefined'));
    // return context;
  }  
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
    isBoardOwner
};
