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
      const { relationId, devId } = req.body;
      const companyId = req.userId;

      const savedCompany = await CompanyUser.findByIdAndUpdate(companyId, {
         $pull: {
            toHire: {
               _id: relationId
            }
         }
      });

      // Se le manda un mensaje avisandole que se descartó
      let conversation = await Conversation.find({
         members: {
            $all: [companyId, devId]
         }
      });
      conversation = conversation[0];


      const defaultMessage = `La empresa ${savedCompany.name} te ha descartado en el paso previo a la contratación.`;
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
      const { relationId, devId, jobTitle } = req.body;
      const companyId = req.userId;

      const newEmployee = {
         employee: devId,
         job: jobTitle
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

      // Se le manda un mensaje avisandole que se le contrató
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
      const { relationId, devId } = req.body;
      const companyId = req.userId;

      const savedCompany = await CompanyUser.findByIdAndUpdate(companyId, {
         $pull: {
            employees: {
               _id: relationId
            }
         }
      });

      // Se le manda un mensaje avisandole que está despedido
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
      // asi solo el dueño de la cuenta puede editar su propio perfil
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
