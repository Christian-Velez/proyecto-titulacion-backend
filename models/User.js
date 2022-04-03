const { Schema, model } = require('mongoose');
const options = { discriminatorKey: 'kind' };

const userSchema = new Schema(
   {
      username: {
         type: String,
         required: true,
         unique: true,
         immutable: true
      },
      passwordHash: {
         type: String,
         required: true,
      },
      name: {
         type: String,
         required: true,
      },
      lastSeen: Date,
   },
   options
);

userSchema.set('toJSON', {
   transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id;
      delete returnedObject._id;
      delete returnedObject.__v;
      delete returnedObject.passwordHash;
   },
});


userSchema.set('toObject', {
   transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id;
      delete returnedObject._id;
      delete returnedObject.__v;
      delete returnedObject.passwordHash;
   },
});

const User = model('User', userSchema);

module.exports = User;
