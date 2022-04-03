




const conversationRouter = require('express').Router();
const handleErrors = require('../middlewares/handleErrors');
const userExtractor = require('../middlewares/userExtractor');
const Conversation = require('../models/Conversation');


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
