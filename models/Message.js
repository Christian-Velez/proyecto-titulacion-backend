const { Schema, model } = require('mongoose');

const messageSchema = new Schema({
   conversationId: {
      type: String,
      required: true,
   },
   sender: {
      type: Schema.Types.ObjectId,
      ref: 'User'
   },
   text: String


}, { timestamps: true });

messageSchema.set('toJSON', {
   transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id;
      delete returnedObject._id;
      delete returnedObject.__v;
   },
});

// Modelo
const Message = model(
   'Message',
   messageSchema
);

module.exports = Message;