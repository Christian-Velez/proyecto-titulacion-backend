const { Schema, model } = require('mongoose');

const conversationSchema = new Schema({
   members: [ {
      type: Schema.Types.ObjectId,
      ref: 'User'
   }],
   blocked: {
      type: Boolean,
      default: false
   }

}, { timestamps: true });

conversationSchema.set('toJSON', {
   transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id;
      delete returnedObject._id;
      delete returnedObject.__v;
   },
});

// Modelo
const Conversation = model(
   'Conversation',
   conversationSchema
);

module.exports = Conversation;
