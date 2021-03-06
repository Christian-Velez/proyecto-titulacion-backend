const handleErrors = require('../middlewares/handleErrors');
const userExtractor = require('../middlewares/userExtractor');
//const userExtractor = require('../middlewares/userExtractor');s
const companyRouter = require('express').Router();
const CompanyUser = require('../models/CompanyUser');
const Conversation = require('../models/Conversation');
const Job = require('../models/Job');
const Message = require('../models/Message');
const Rating = require('../models/Rating');

// Obtener la info de 1 empresa 
// Solo la misma empresa puede obtener toda su informacion
companyRouter.get('/:id' ,async (req, resp, next) => {
      try {
         const { id } = req.params;

        
         const companyUser = await CompanyUser.findById(id)
               .populate('mostReqTechnology')
               .populate('toHire.candidate')
               .populate('employees.employee')
               .populate('firedDevelopers.dev');
               

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
            .populate('rejectedUsers', {
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

// Configurar mensajes predeterminados
companyRouter.post('/defaultMessages/:id', userExtractor, async(req, resp, next) => {
   try {
      const { id } = req.params;
      const { defaultMessages } = req.body;

      const company = await CompanyUser.findById(id);

      // Elimina los mensajes anteriores
      delete company.defaultMessages;
      await company.save();

      // Detecta los nuevos
      const newMessagesKeys = Object.keys(defaultMessages);
      newMessagesKeys.forEach(key => {
         // Si viene un mensaje predeterminado, lo inserta
         if(!defaultMessages[key]) {
            delete defaultMessages[key]
         }
      });

      company.defaultMessages = defaultMessages;
      await company.save();

      resp.status(200).json({ Message: 'Mensajes guardados ' });



   } catch(err) {
      next(err);
   }
})


// Descartar a un programador de "toHire"
companyRouter.post('/discardDeveloper', userExtractor, async(req, resp, next) => {
   try {
      const { relationId, devId, jobId } = req.body;
      const companyId = req.userId;

      // Lo quita de la lista "por contratar"
      const savedCompany = await CompanyUser.findByIdAndUpdate(companyId, {
         $pull: {
            toHire: {
               _id: relationId
            }
         }
      });

      // Lo marca como "ya rechazado" de la oferta de trabajo en particular
      await Job.findByIdAndUpdate(jobId, {
         $push: {
            rejectedUsers: devId
         }
      })


      // Se le manda un mensaje avisandole que se descart??
      let conversation = await Conversation.find({
         members: {
            $all: [companyId, devId]
         }
      });
      conversation = conversation[0];


      const defaultMessage = `La empresa ${savedCompany.name} te ha descartado en el paso previo a la contrataci??n.`;
      //const { defaultMessages = {} } = savedCompany;

      const newMessage = new Message({
         conversationId: conversation._id,
         sender: savedCompany._id,
         text: defaultMessage
      });

      await newMessage.save();

      // Se bloquea la conversacion
      await Conversation.findByIdAndUpdate(conversation._id, {
         blocked: true
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
      const { relationId, devId, jobTitle, jobId } = req.body;
      const companyId = req.userId;

      const newEmployee = {
         employee: devId,
         job: jobTitle,
         jobId
      };

      const savedCompany = await CompanyUser.findByIdAndUpdate(companyId,  {
         $pull: {
            toHire: {
               _id:  relationId
            }
         },
         $push: {
            employees: newEmployee
         }
      });

      // Se le manda un mensaje avisandole que se le contrat??
      let conversation = await Conversation.find({
         members: {
            $all: [companyId, devId]
         }
      });
      conversation = conversation[0];

      const defaultMessage = `La empresa ${savedCompany.name} te ha contratado.`;
      const { defaultMessages = {} } = savedCompany;

      const newMessage = new Message({
         conversationId: conversation._id,
         sender: savedCompany._id,
         text: defaultMessages.hireDev || defaultMessage
      });

      await newMessage.save();




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
      const { relationId, devId, jobId } = req.body;
      const companyId = req.userId;


      const newFiredDev = {
         dev: devId,
         jobId
      }

      const savedCompany = await CompanyUser.findByIdAndUpdate(companyId, {
         $pull: {
            employees: {
               _id: relationId
            }
         },
         $push: {
            firedDevelopers: newFiredDev
         }
      });

      // Se le manda un mensaje avisandole que est?? despedido
      let conversation = await Conversation.find({
         members: {
            $all: [savedCompany._id.toString(), devId]
         }
      });
      conversation = conversation[0];

      const defaultMessage = `La empresa ${savedCompany.name} te ha despedido.`;
      const { defaultMessages = {} } = savedCompany;

      const newMessage = new Message({
         conversationId: conversation._id,
         sender: savedCompany._id,
         text: defaultMessages.fireDev || defaultMessage
      });

      await newMessage.save();

      // Se bloquea la conversacion
      await Conversation.findByIdAndUpdate(conversation._id, {
         blocked: true
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
      // asi solo el due??o de la cuenta puede editar su propio perfil
      if (id !== req.userId || req.kind !== 'Company') {
         return resp.status(401).json({
            Message: 'Permisos insuficientes',
         });
      }

      console.log(userInfo);
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
