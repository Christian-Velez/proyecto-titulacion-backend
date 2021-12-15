
const { Schema } = require('mongoose');
const User = require('./User')
const options = { discriminatorKey: 'kind' };

// Deriva del modelo User
const AdminUser = User.discriminator(
   'Admin',
   new Schema(
      {
         privilegesInDB: Boolean,
      },
      options
   )
);

// Modelo
module.exports = AdminUser;
