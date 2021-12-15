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
         technologies: [],
         softskills: [],
         projects: [],
         education: [],
         certifications: [],
         applications: [],
      },
      options
   )
);

// Modelo
module.exports = DeveloperUser;
