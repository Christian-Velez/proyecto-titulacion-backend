const { Schema } = require('mongoose');
const User = require('./User');
const options = { discriminatorKey: 'kind' };


// Deriva del modelo User
const DeveloperUser = User.discriminator(
   'Developer',
   new Schema(
      {
         location: {
            type: String,
            required: true,
         },
         description: String,
         img: String,
         curriculum: String,
         qualifications: [{
            
         }],
         technologies: [{
            technology: {
               type: Schema.Types.ObjectId,
               ref: 'Technology', 
            },
            yearsOfExperience: Number
         }],
         softskills: [{
            type: Schema.Types.ObjectId,
            ref: 'Softskill', 
         }],
         projects: [{
            img: String,
            title: String,
            linkDemo: String,
            linkGH: String
         }],
         education: [{
            title: String,
            institution: String,

         }],
         certifications: [],
         applications: [],
      },
      options
   )
);

// Modelo
module.exports = DeveloperUser;
