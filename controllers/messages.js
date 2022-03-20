const messageRouter = require('express').Router();
const handleErrors = require('../middlewares/handleErrors');
const userExtractor = require('../middlewares/userExtractor');
const Message = require('../models/Message');


messageRouter.post('/', async(req, resp, next) => {
   try {
      
      const { conversationId, sender, text} = req.body;

      if(!conversationId || !sender || !text) {
         resp.send(400).json({
            Message: 'Datos insuficientes'
         });
      }

      const newMessage = new Message(req.body);
      let savedMessage = await newMessage.save();
      savedMessage = await savedMessage.populate('sender');

      resp.status(200).json({
         Message: 'Mensaje guardado',
         savedMessage
      });
   
   
   } catch(err) {
      next(err);
   }
});


messageRouter.get('/:conversationId', async(req, resp, next) => {
   try { 
      const { conversationId } = req.params;

      const messages = await Message.find({
         conversationId
      }).populate('sender');

      resp.status(200).json({
         messages
      });

   } catch(err) {
      next(err);
   }
});




messageRouter.use(handleErrors);
module.exports = messageRouter;
