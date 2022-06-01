//const bcrypt = require('bcrypt');
//const handleErrors = require('../middlewares/handleErrors');
const handleErrors = require('../middlewares/handleErrors');
const userExtractor = require('../middlewares/userExtractor');
const CompanyUser = require('../models/CompanyUser');
const Conversation = require('../models/Conversation');
const developerRouter =
   require('express').Router();
const DeveloperUser = require('../models/DeveloperUser');
const Rating = require('../models/Rating');
const Job = require('../models/Job');

// Obtener la info de 1 desarrollador
developerRouter.get(
   '/:id',
   async (req, resp, next) => {
      try {
         const { id } = req.params;

         const devUser =
            await DeveloperUser.findById(id)
               .populate(
                  'technologies.technology'
               )
               .populate('softskills');

         const qualifications = await Rating.find(
            {
               user: id,
            }
         );

         resp.status(200).json({
            message: 'Usuario encontrado',
            devInfo: {
               ...devUser.toObject(),
               qualifications,
            },
         });
      } catch (err) {
         next(err);
      }
   }
);

developerRouter.get(
   '/getRejectedJobs/:devId',
   userExtractor,
   async (req, resp, next) => {
      try {
         const { devId } = req.params;
         if (devId !== req.userId) {
            return resp
               .status(401)
               .json({
                  Message:
                     'Permisos insuficientes',
               });
         }

         const rejectedJobs = await Job.find({
            rejectedUsers: devId,
         })
            .populate('company', {
               name: 1,
               img: 1,
               location: 1,
               lastSeen: 1,
            })
            .populate('techsRequired.technology', {
               name: 1,
               img: 1,
               
            })
            .populate('softsRequired')

         resp.status(200).json({ rejectedJobs });
      } catch (err) {
         next(err);
      }
   }
);

developerRouter.get(
   '/getDevCompanies/:devId',
   userExtractor,
   async (req, resp, next) => {
      try {
         const { devId } = req.params;

         if (devId !== req.userId) {
            return resp
               .status(401)
               .json({
                  Message:
                     'Permisos insuficientes',
               });
         }

         const companies = await CompanyUser.find(
            {
               'employees.employee': devId,
            }
         );

         resp.status(200).json({ companies });
      } catch (err) {
         next(err);
      }
   }
);

// Agregar una tecnologia
developerRouter.put(
   '/addTech',
   userExtractor,
   async (req, resp, next) => {
      try {
         const {
            id,
            technology,
            yearsOfExperience,
         } = req.body;
         if (
            id !== req.userId ||
            req.kind !== 'Developer'
         ) {
            return resp.status(401).json({
               Message: 'Permisos insuficientes',
            });
         }

         await DeveloperUser.findByIdAndUpdate(
            id,
            {
               $push: {
                  technologies: {
                     technology,
                     yearsOfExperience,
                  },
               },
            }
         );

         resp.status(200).json({ Message: 'Ok' });
      } catch (err) {
         next(err);
      }
   }
);

// Actualizar el perfil de un desarrollador
developerRouter.put(
   '/:id',
   userExtractor,
   async (req, resp, next) => {
      try {
         const { id } = req.params;
         let userInfo = req.body;

         // Para seguridad
         // Revisa que el id que me manda en el token y el que se quiere editar sean el mismo
         // asi solo el dueño de la cuenta puede editar su propio perfil
         if (
            id !== req.userId ||
            req.kind !== 'Developer'
         ) {
            return resp.status(401).json({
               Message: 'Permisos insuficientes',
            });
         }

         // Elimina los ID provisionales que necesito en el frontend para renderizar
         userInfo.education &&
            (userInfo.education =
               userInfo.education.map((ed) => {
                  delete ed._id;
                  return ed;
               }));

         userInfo.certifications &&
            (userInfo.certifications =
               userInfo.certifications.map(
                  (cer) => {
                     delete cer._id;
                     return cer;
                  }
               ));

         const savedUser =
            await DeveloperUser.findByIdAndUpdate(
               id,
               userInfo,
               { new: true }
            )
               .populate(
                  'technologies.technology'
               )
               .populate('softskills');

         resp.status(200).json({
            message: 'ok',
            newUser: savedUser,
         });
      } catch (err) {
         next(err);
      }
   }
);

developerRouter.use(handleErrors);

module.exports = developerRouter;
