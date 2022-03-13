const { Schema } = require('mongoose');
const User = require('./User');
const options = { discriminatorKey: 'kind' };

// Deriva del modelo User
const CompanyUser = User.discriminator(
   'Company',
   new Schema(
      {
         line: String,
         img: String,
         location: {
            type: String,
            required: true,
         },
         description: String,
         qualifications: [],
         mostReqTechnology: {
            type: Schema.Types.ObjectId,
            ref: 'Technology',
         },
         toHire: [
            {
               candidate: {
                  type: Schema.Types.ObjectId,
                  ref: 'Developer',
               },
               job: String,
            },
         ],
         employees: [
            {
               employee: {
                  type: Schema.Types.ObjectId,
                  ref: 'Developer',
               },
               date: {
                  type: Date,
                  default: Date.now
               },
               job: String,
            },
         ],
      },

      options
   )
);

// Modelo
module.exports = CompanyUser;
