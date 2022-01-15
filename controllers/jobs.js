


const jobRouter = require('express').Router();
const handleErrors = require('../middlewares/handleErrors');
const userExtractor = require('../middlewares/userExtractor');
const Job = require('../models/Job');
const CompanyUser = require('../models/CompanyUser');
const Technology = require('../models/Technology');


// Obtener todos los trabajos - Dev
jobRouter.get('/', async (req, resp, next) => {

   // Si la aplicacion crece demasiado (muchos trabajos publicados)
   // Se tiene que agregar paginacion
   
   try{
      const jobs = 
         await Job.find({
            active: true
         })
            .populate('company', {
               name: 1,
               img: 1,
               location: 1,
            })
            .populate('techsRequired.technology', {
               name: 1,
               img: 1,
               
            })
            .populate('softsRequired')
            .sort([['created_at', -1]]);
      
      resp.status(200).json(jobs);
   } catch(err) {
      next(err);
   }
});


// Ultimos trabajos -> los utilizo en la landing page 
jobRouter.get('/last', async(req, resp, next) => {
   try {
      const lastJobs = 
         await Job.find({}, {
            title: 1,
            created_at: 1
         })
            .sort({ created_at: -1 })
            .limit(2)
            .populate('company', {
               name: 1,
               img: 1,
            });

      resp.status(200).json(lastJobs);
   }

   catch(err) {
      next(err);
   }

});


// Compañia - Postear un trabajo
jobRouter.post('/', userExtractor, async(req, resp, next) => {
   try{
      
      if(!req.userId || req.kind !== 'Company') {
         return resp.status(401).json({
            Message: 'Necesitas una cuenta de tipo empresa para postear ofertas'
         });
      }
      
      const job = req.body;
      const company = await CompanyUser.findById(req.userId);


      const newJob = new Job({
         ...job,
         company: company._id
      });

      let savedJob = await newJob.save();
      savedJob = await savedJob.populate('techsRequired.technology');

     

      // Envio la respuesta
      resp.status(200).json(savedJob);



      // ... Procesos no indispensables o relacionados con la oferta
      // Actualiza los contadores de las tecnologias solicitadas
      const { techsRequired } = savedJob;
      await Promise.all(
         techsRequired.map(async (required) => {
            const { technology } = required;
            await Technology.findByIdAndUpdate(technology, {
               $inc: {
                  timesRequested: 1
               }
            });
         })
      );


   }catch(err){
      next(err);
   }
});


// Compañia - Editar un trabajo (e.g: Archivar o desarchivar un trabajo)
jobRouter.put('/:jobId', userExtractor, async(req, resp, next) => {
   try {
      const newJobInfo = req.body;

      const { jobId }= req.params;
      let job = await Job.findById(jobId);

      if(!job) {
         return resp.send(404).json({Message: 'Oferta de trabajo no encontrada'});
      }


      if(req.userId !== job.company.toString()) {
         return resp.status(401).json({
            Message: 'No puedes editar esta oferta'
         });
      }

      const updatedJob = 
         await Job.findByIdAndUpdate(jobId, newJobInfo, { new: true})
            .populate('techsRequired.technology')
            .populate('applicants', {
               img: 1,
               softskills: 1,
               name: 1,
               technologies: 1,
               location: 1
            });
      resp.status(200).json({ updatedJob });
   } catch(err) {
      next(err);
   }
});



// Dev - Aplicar a un trabajo
jobRouter.put('/apply/:jobId', userExtractor, async(req, resp, next) => {
   try {

      const { jobId } = req.params;
      const savedJob = await Job.findByIdAndUpdate(jobId, {
         $push: {
            applicants: req.userId
         }
      }, { new: true})
         .populate('company')
         .populate('techsRequired.technology')
         .populate('softsRequired');

      
      if(!savedJob) {
         return resp.send(404).json({Message: 'Oferta de trabajo no encontrada'});
      }

      resp.status(200).json(savedJob);
     
   } catch(err) {
      next(err);
   }
});

// Dev - Cancelar postulacion
jobRouter.put('/cancelapply/:jobId', userExtractor, async(req, resp, next) => {
   try {
      
      const { jobId } = req.params;

      const savedJob = await Job.findByIdAndUpdate(jobId, {
         $pull: {
            applicants: req.userId
         }
      }, { new: true})
         .populate('company')
         .populate('techsRequired.technology')
         .populate('softsRequired');


      if(!savedJob) {
         return resp.send(404).json({Message: 'Oferta de trabajo no encontrada'});
      }

      resp.status(200).json(savedJob);
   } catch(err) {
      next(err);
   }
});





jobRouter.use(handleErrors);
module.exports = jobRouter;
