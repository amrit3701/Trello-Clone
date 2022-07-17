// cards-model.js - A mongoose model
// 
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.
module.exports = function (app) {
  const modelName = 'cards';
  const mongooseClient = app.get('mongooseClient');
  const { Schema } = mongooseClient;
  const schema = new Schema({
    title: { type: String, required: true},
    description: { type: String, required: false},
    order: { type: Number, required: true, default: 0},
    listId: { type: Schema.Types.ObjectId, ref: 'lists' },
    boardId: { type: Schema.Types.ObjectId, ref: 'boards' },
    members: [{ type: Schema.Types.ObjectId, refs: 'users' }],
    archived: { type: Boolean, required: true, default: false },
  }, {
    timestamps: true
  });

  // This is necessary to avoid model compilation errors in watch mode
  // see https://mongoosejs.com/docs/api/connection.html#connection_Connection-deleteModel
  if (mongooseClient.modelNames().includes(modelName)) {
    mongooseClient.deleteModel(modelName);
  }
  return mongooseClient.model(modelName, schema);
  
};
