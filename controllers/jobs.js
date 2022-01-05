


const jobRouter = require('express').Router();
const handleErrors = require('../middlewares/handleErrors');
const userExtractor = require('../middlewares/userExtractor');
const Job = require('../models/Job');
const CompanyUser = require('../models/CompanyUser');
const Technology = require('../models/Technology');


// Obtener todos los trabajos
jobRouter.get('/', async (req, resp, next) => {
   try{
      const jobs = await Job.find({});
      resp.status(200).json(jobs);

   } catch(err) {
      next(err);
   }
});


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

      const savedJob = await newJob.save();

      // MongoDB por detras actualiza la base de datos
      company.jobs = company.jobs.concat(savedJob._id);
      await company.save();

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

jobRouter.use(handleErrors);
module.exports = jobRouter;
