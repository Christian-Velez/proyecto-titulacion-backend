const { Schema, model } = require('mongoose');

const softSkillSchema = new Schema({
   name: {
      type: String,
      required: true,
   },
   img: {
      type: String,
      required: true,
   },
});

softSkillSchema.set('toJSON', {
   transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id;
      delete returnedObject._id;
      delete returnedObject.__v;
   },
});

// Modelo
const Softskill = model(
   'Softskill',
   softSkillSchema
);

module.exports = Softskill;
