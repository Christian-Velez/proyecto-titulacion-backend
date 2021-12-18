
const technologyRouter = require('express').Router();
const handleErrors = require('../middlewares/handleErrors');
const Technology = require('../models/Technology');
const userExtractor = require('../middlewares/userExtractor');


technologyRouter.get('/', async (req, resp, next) => {
   try{
      const technologies = await Technology.find({}).populate('relatedTechs');

      resp.status(200).json(technologies);
   } catch(err) {
      next(err);
   }
});


technologyRouter.post('/', userExtractor, async(req, resp, next) => {
   try{
      if(req.kind !== 'Admin') {
         return resp.status(401).json({
            Message: 'Permisos insuficientes'
         });
      }
      
      
      const { body } = req;
      const newTechnology = new Technology(body);
      let savedTechnology = await newTechnology.save();


      // Regresa el JOIN con las tecnologias relacionadas ya que utilizo esta info
      // en el frontEnd

      // Al actualizar una tecnologia: Ver -> components/admin/Technology
      savedTechnology = await savedTechnology.populate('relatedTechs');
      

      resp.status(200).json(savedTechnology);

   }catch(err){
      next(err);
   }

});



// Actualizar una tecnologia
technologyRouter.put('/:id', userExtractor, async(req, resp, next) => {
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
      let updatedTechnology = await Technology.findByIdAndUpdate(id, body, { new: true });
      updatedTechnology = await updatedTechnology.populate('relatedTechs');

      resp.status(200).send(updatedTechnology);

   } catch(err) {
      next(err);
   }

});


technologyRouter.use(handleErrors);



module.exports = technologyRouter;