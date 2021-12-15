const { Schema, model } = require('mongoose');
const options = { discriminatorKey: 'kind' };

const userSchema = new Schema(
   {
      // Los 3 tipos de usuario tienen estos campos
      username: {
         type: String,
         required: true,
         unique: true,
      },
      passwordHash: {
         type: String,
         required: true,
      },
      name: {
         type: String,
         required: true,
      },
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

const User = model('User', userSchema);

module.exports = User;