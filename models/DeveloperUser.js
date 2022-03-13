const { Schema } = require('mongoose');
const User = require('./User');
const options = { discriminatorKey: 'kind' };


// Deriva del modelo User
const DeveloperUser = User.discriminator(
   'Developer',
   new Schema(
      {
         location: String,
         age: Number,
         description: String,
         img: String,
         curriculum: String,
         technologies: [{
            technology: {
               type: Schema.Types.ObjectId,
               ref: 'Technology', 
            },
            yearsOfExperience: Number
         }],
         softskills: [
            {
               type: Schema.Types.ObjectId,
               ref: 'Softskill', 
            },
         ],
         projects: [{
            img: {
               type: String,
               required: true
            }, 
            title: {
               type: String,
               required: true
            },
            linkDemo: String,
            linkGH: String
         }],
         education: [{
            title: {
               type: String,
               required: true
            },
            institution: {
               type: String,
               required: true
            },
            year: {
               type: String,
               required: true
            }
         }],
         certifications: [{
            img: {
               type: String,
               required: true,
            },
            title: {
               type: String,
               required: true,
            },
            institution: {
               type: String,
               required: true
            },
            year: {
               type: String,
               required: true
            }
         }],
         //applications: [],
         qualifications: [{}]
      },
      options
   )
);

// Modelo
module.exports = DeveloperUser;
