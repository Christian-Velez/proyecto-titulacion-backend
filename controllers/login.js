const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const User = require('../models/User');
const loginRouter = require('express').Router();
const handleErrors = require('../middlewares/handleErrors');

loginRouter.post('/', async (req, resp, next) => {
   try {
      const { body } = req;

      console.log(body);
      const { username, password } = body;

      const user = await User.findOne({
         username,
      });

      const passwordCorrect =
         user === null
            ? false
            : await bcrypt.compare(
                 password,
                 user.passwordHash
              );

      // Comprueba que password y user sean correctos
      if (!(user && passwordCorrect)) {
         return resp.status(401).json({
            message: 'Invalid user or password',
         });
      }

      const { id, username: uUsername, kind, ...rest } = user.toJSON();

     

      // Datos importantes enviados en el token que se usaran despues para hacer peticiones
      const userForToken = {
         id,
         uUsername,
         kind: kind,
      };

      const token = jwt.sign(
         userForToken,
         process.env.JWT_SECRET
      );

      resp.status(201).json({
         message: 'Login successful',
         kind,
         token,
         rest
      });
   } catch (err) {
      next(err);
   }
});

loginRouter.post(
   '/verify',
   async (req, resp, next) => {
      try {
         // Header de autorizacion
         const authorization = req.get(
            'authorization'
         );
         let token = null;

         if (
            authorization &&
            authorization
               .toLowerCase()
               .startsWith('bearer')
         ) {
            token = authorization.substring(7);
         }

         const decodedToken = jwt.verify(
            token,
            process.env.JWT_SECRET
         );

         if (!token || !decodedToken.id) {
            return resp.status(401).json({
               Message:
                  'Token missing or invalid',
            });
         }

         resp.status(202).json({ isValid: true });
      } catch (err) {
         next(err);
      }
   }
);

// ELIMINAR DESPUES
loginRouter.get('/', async (req, resp) => {
   const users = await User.find({});
   resp.status(201).json(users);
});

loginRouter.use(handleErrors);

module.exports = loginRouter;
