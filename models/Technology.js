const { Schema, model } = require('mongoose');

const technologySchema = new Schema({
   name: {
      type: String,
      unique: true,
      required: true,
   },
   img: {
      type: String,
      required: true,
   },
   description: {
      type: String,
      required: true,
   },
   type: {
      type: String,
      required: true,
   },
   categories: {
      type: [String],
      required: true,
   },
   relatedTechs: [
      {
         type: Schema.Types.ObjectId,
         ref: 'Technology',
      },
   ],

   timesRequested: {
      type: Number,
      default: 0,
   },
});

technologySchema.set('toJSON', {
   transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id;
      delete returnedObject._id;
      delete returnedObject.__v;
   },
});

// Modelo
const Technology = model(
   'Technology',
   technologySchema
);

module.exports = Technology;
