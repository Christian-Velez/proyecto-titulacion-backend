
const technologyRouter = require('express').Router();
const handleErrors = require('../middlewares/handleErrors');
const Technology = require('../models/Technology');
const userExtractor = require('../middlewares/userExtractor');

// Todas las tecnologias o por parametros
technologyRouter.get('/', async (req, resp, next) => {
   try{
      let technologies;
      //const query = req.query;
      //if(query.name || query.type) {
      //   technologies = await Technology.find({
      //      name: {
      //         $regex: query.name, 
      //         $options: 'i'
      //      },
      //      type: {
      //         $regex: query.type, 
      //         $options: 'i'
      //      }
      //   });
      //}
      //else{
      
      technologies = await Technology.find({}).populate('relatedTechs');
      //}

   
      resp.status(200).json(technologies);
   } catch(err) {
      next(err);
   }
});

// Nueva tecnologia -> solo admin
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



// Actualizar una tecnologia -> Solo admin
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


technologyRouter.delete('/:id', userExtractor, async(req, resp, next) => {
   try {
      if(req.kind !== 'Admin') {
         return resp.status(401).json({
            Message: 'Permisos insuficientes'
         });
      }
      const { id } = req.params;
      await Technology.findByIdAndDelete(id);

      resp.status(200).json({
         Message: 'Tecnologia eliminada'
      });
   } catch(err) {
      next(err);
   }
});


technologyRouter.use(handleErrors);



module.exports = technologyRouter;