

const softSkillRouter = require('express').Router();
const handleErrors = require('../middlewares/handleErrors');
const userExtractor = require('../middlewares/userExtractor');
const Softskill = require('../models/Softskill');



softSkillRouter.get('/', async (req, resp, next) => {
   try{
      const softskills = await Softskill.find({});
      resp.status(200).json(softskills);

   } catch(err) {
      
      next(err);
   }
});


softSkillRouter.post('/', userExtractor, async(req, resp, next) => {
   try{
      if(req.kind !== 'Admin') {
         return resp.status(401).json({
            Message: 'Permisos insuficientes'
         });
      }
      
      const { body } = req;
      const newSoftSkill = new Softskill(body);
      const savedSoftskill = await newSoftSkill.save();
   
      resp.status(200).json(savedSoftskill);
   } catch(err){
      next(err);
   }
});



// Actualizar una soft skill
softSkillRouter.put('/:id', userExtractor, async(req, resp, next) => {
   try {
      if(req.kind !== 'Admin') {
         return resp.status(401).json({
            Message: 'Permisos insuficientes'
         });
      }
      const { id } = req.params;
      const { body } = req;


      // Con el tercer parametro le indico que me devuelva
      // el nuevo resultado
      const updatedSoftskill = await Softskill.findByIdAndUpdate(id, body, { new: true });
     

      resp.status(200).send(updatedSoftskill);

   } catch(err) {
      next(err);
   }

});


softSkillRouter.delete('/:id', userExtractor, async(req, resp, next) => {
   try {
      if(req.kind !== 'Admin') {
         return resp.status(401).json({
            Message: 'Permisos insuficientes'
         });
      }
      const { id } = req.params;


      await Softskill.findByIdAndDelete(id);
     

      resp.status(200).json({
         Mensaje: 'Softskill eliminada'
      });

   } catch(err) {
      next(err);
   }
});


softSkillRouter.use(handleErrors);


module.exports = softSkillRouter;
