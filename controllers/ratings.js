



const ratingRouter = require('express').Router();
const handleErrors = require('../middlewares/handleErrors');
const userExtractor = require('../middlewares/userExtractor');
const Rating = require('../models/Rating');



ratingRouter.post('/', userExtractor, async(req, resp, next) => {
   try {

      const { body } = req;

      if(!body.user || !body.ratings || !body.ratedBy) {
         resp.status(400).json({
            Message: 'Datos inválidos'
         });
      }

      const rate = new Rating(req.body);
      const savedRate = await rate.save();

      resp.status(200).json({
         Message: 'Calificación guardada',
         rate: savedRate
      });

   } catch(err) {
      next(err);
   }
});


ratingRouter.use(handleErrors);
module.exports = ratingRouter;