const handleErrors = require('../middlewares/handleErrors');
const userExtractor = require('../middlewares/userExtractor');
//const userExtractor = require('../middlewares/userExtractor');s
const companyRouter = require('express').Router();
const CompanyUser = require('../models/CompanyUser');
const Job = require('../models/Job');
const Rating = require('../models/Rating');

// Obtener la info de 1 empresa 
// Solo la misma empresa puede obtener toda su informacion
companyRouter.get('/:id' ,async (req, resp, next) => {
      try {
         const { id } = req.params;

        
         const companyUser = await CompanyUser.findById(id)
               .populate('mostReqTechnology')
               .populate('toHire.candidate')
               .populate('employees.employee');
               

         const jobs = await Job.find({
            company: companyUser._id
         })
            .populate('techsRequired.technology')
            .populate('applicants', {
               img: 1,
               softskills: 1,
               name: 1,
               technologies: 1,
               location: 1
            })
            .sort([['created_at', -1]]);


         const qualifications = await Rating.find({
            user: companyUser._id
         });

         let companyInfo = {
            ...companyUser.toObject(),
            jobs,
            qualifications,
         };
               
         resp.status(200).json({
            message: 'Usuario encontrado',
            companyInfo,
         });
      } catch (err) {
         next(err);
      }
   }
);

// Descartar a un programador de "toHire"
companyRouter.post('/discardDeveloper', userExtractor, async(req, resp, next) => {
   try {
      const { relationId } = req.body;
      const companyId = req.userId;

      await CompanyUser.findByIdAndUpdate(companyId, {
         $pull: {
            toHire: {
               _id: relationId
            }
         }
      });

      resp.status(200).json({
         message: 'Programador descartado',
      });

   } catch(err) {
      next(err);
   }
});

// Contratar a un programador
companyRouter.post('/hireDeveloper', userExtractor, async(req, resp, next) => {
   try {
      const { relationId, devId, jobTitle } = req.body;
      const companyId = req.userId;

      const newEmployee = {
         employee: devId,
         job: jobTitle
      };

      await CompanyUser.findByIdAndUpdate(companyId,  {
         $pull: {
            toHire: {
               _id:  relationId
            }
         },
         $push: {
            employees: newEmployee
         }
      });

      resp.status(200).json({
         message: 'Programador contratado'
      });

   } catch(err) {
      next(err);
   }
});

// Despedir a un programador
companyRouter.post('/fireDeveloper', userExtractor, async(req, resp, next) => {
   try {
      const { relationId } = req.body;
      const companyId = req.userId;

      await CompanyUser.findByIdAndUpdate(companyId, {
         $pull: {
            employees: {
               _id: relationId
            }
         }
      });

      resp.status(200).json({
         message: 'Programador despedido',
      });

   } catch(err) {
      next(err);
   }
});

// Actualizar la info de 1 empresa 
companyRouter.put('/:id', userExtractor ,async (req, resp, next) => {
   try {
      const { id } = req.params;
      let userInfo = req.body;


      // Para seguridad
      // Revisa que el id que me manda en el token y el que se quiere editar sean el mismo
      // asi solo el dueño de la cuenta puede editar su propio perfil
      if (id !== req.userId || req.kind !== 'Company') {
         return resp.status(401).json({
            Message: 'Permisos insuficientes',
         });
      }

      const savedCompany =
         await CompanyUser.findByIdAndUpdate(
            id,
            userInfo,
            { new: true }
         )
         .populate('mostReqTechnology')
         .populate('toHire.candidate')
         .populate('employees.employee');

      resp.status(200).json({
         message: 'ok',
         newUser: savedCompany,
      });

   }catch(err){
      next(err);
   }
});






companyRouter.use(handleErrors);

module.exports = companyRouter;
