const { Schema, model } = require('mongoose');

const ratingSchema = new Schema({
   user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
   },
   ratings: {
      type: {},
      required: true
   },
   ratedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
   },
});

const Rating = model('Rating', ratingSchema);
module.exports = Rating;
