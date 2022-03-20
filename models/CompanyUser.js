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
         technologiesHistory: [String],
         mostReqTechnology: {
            type: Schema.Types.ObjectId,
            ref: 'Technology',
         },
         yearsOfExpHistory: [Number],
         averageYears: Number,
      },

      options
   )
);

// Modelo
module.exports = CompanyUser;
