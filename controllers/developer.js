//const bcrypt = require('bcrypt');
//const handleErrors = require('../middlewares/handleErrors');

const handleErrors = require('../middlewares/handleErrors');
const developerRouter =
   require('express').Router();
const DeveloperUser = require('../models/DeveloperUser');

// Obtener la info de 1 desarrollador
developerRouter.get(
   '/:id',
   async (req, resp, next) => {
      try {
         const { id } = req.params;

         const devUser = await DeveloperUser.findById(id).populate('technologies.technology').populate('softskills');
         
         resp.status(200).json({ 
            message: 'Todo fine',
            devInfo: devUser 
         
         });
      } catch (err) {
         next(err);
      }
   }
);

// Actualizar el perfil de un desarrollador
developerRouter.put('/:id', async (req, resp, next) => {
   try {
      const { id } = req.params;
      const userInfo = req.body;
      
      const savedUser = await DeveloperUser.findByIdAndUpdate(id, userInfo , { new: true });
      
      resp.status(200).json({
         message: 'ok',
         newUser: savedUser
      });
   }
   catch(err){
      next(err);
   }
});

developerRouter.use(handleErrors);

module.exports = developerRouter;
