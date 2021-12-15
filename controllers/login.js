const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const User = require('../models/User');
const loginRouter = require('express').Router();

loginRouter.post('/', async (req, resp) => {
   const { body } = req;
   const { username, password } = body;

   const user = await User.findOne({ username });

   const passwordCorrect =
      user === null
         ? false
         : await bcrypt.compare( password, user.passwordHash );

   // Comprueba que password y user sean correctos
   if (!(user && passwordCorrect)) {
      return resp.status(401).json({
         message: 'invalid user or password',
      });
   }
 
   // Datos importantes enviados en el token
   const userForToken = {
      id: user._id,
      username: user.username,
      kind: user.kind
   };

   const token = jwt.sign(
      userForToken,
      process.env.JWT_SECRET
   );

   resp.status(201).json({
      message: 'Login successful',
      username: user.username,
      token,
   });
});



// ELIMINAR DESPUES
loginRouter.get('/', async(req, resp) => {
   const users = await User.find({});
   resp.status(201).json(users);
});

module.exports = loginRouter;
