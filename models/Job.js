const { Schema, model } = require('mongoose');

const jobSchema = new Schema({
   company: {
      type: Schema.Types.ObjectId,
      ref: 'Company',
   },
   title: {
      type: String,
      required: true,
   },
   description: {
      type: String,
      required: true,
   },
   category: {
      type: String,
      required: true,
   },
   techsRequired: {
      type: [
         {
            technology: {
               type: Schema.Types.ObjectId,
               ref: 'Technology',
               required: true,
            },
            yearsOfExperience: {
               type: Number,
               required: true,
            },
         },
      ],

      required: true,
   },

   softsRequired: [
      {
         type: Schema.Types.ObjectId,
         ref: 'Softskill',
      },
   ],

   salary: {
      type: Number,
      required: true,
   },

   additional: String,
   date: {
      type: Date,
      default: Date.now,
   },
   active: {
      type: Boolean,
      default: true,
   },
   candidates: [{ type: Schema.Types.ObjectId, ref: 'Developer' }],
});

jobSchema.set('toJSON', {
   transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id;
      delete returnedObject._id;
      delete returnedObject.__v;
   },
});

// Modelo
const Job = model('Job', jobSchema);

module.exports = Job;
