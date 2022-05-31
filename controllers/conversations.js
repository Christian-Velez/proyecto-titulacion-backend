




const conversationRouter = require('express').Router();
const handleErrors = require('../middlewares/handleErrors');
const userExtractor = require('../middlewares/userExtractor');
const CompanyUser = require('../models/CompanyUser');
const Conversation = require('../models/Conversation');


conversationRouter.post('/blockConversation', userExtractor, async(req, resp, next) => {
   try {
      const { 
         userId, kind,
         conversationId
      } = req.body;


      // si se va a bloquear a una empresa...
      // el usuario "developer" renuncia, por lo tanto...
      if(kind === 'Company') {
         // Eliminar de postulantes
         // Eliminar de contratados
         await CompanyUser.findByIdAndUpdate(userId, {
            $pull: {
               employees: {
                  employee: req.userId
               },

               toHire: {
                  candidate: req.userId
               }
            }
         })
      } 
      
      // Bloquear el chat
      await Conversation.findByIdAndUpdate(conversationId, { blocked: true });
      resp.status(200).json({ Message: 'Usuario bloqueado' });


   } catch(err) {
      next(err);
   }
})

conversationRouter.post('/', async(req, resp, next) => {
   try {
      const { senderId, receiverId } = req.body;

      if(!senderId || !receiverId) {
         resp.status(400).json({
            Message: 'Datos insuficientes'
         });
      }

      const newConversation = new Conversation({
         members: [senderId, receiverId]
      });

      const savedConversation = await newConversation.save();
      resp.status(200).json({
         Message: 'Conversación guardada',
         savedConversation
      });


   } catch(err) {
      next(err);
   }
});


conversationRouter.get('/:userId', async(req, resp, next) => {
   try {
      const { userId } = req.params;
      const conversations = await Conversation.find({
         members: {
            $in: [userId]
         }
      })
         .sort({ updatedAt: -1})
         .populate('members');

      resp.status(200).json({
         conversations
      });

   } catch(err) {
      next(err);
   }
});




conversationRouter.use(handleErrors);
module.exports = conversationRouter;
