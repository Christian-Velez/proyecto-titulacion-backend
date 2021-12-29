const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const User = require('../models/User');
const loginRouter = require('express').Router();
const handleErrors = require('../middlewares/handleErrors');



// Hacer el inicio de sesión
loginRouter.post('/', async (req, resp, next) => {
   try {
      const { body } = req;
      const { username, password } = body;

      let user = await User.findOne({username});

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

     
      // Datos importantes enviados en el token que se usaran despues para comprobar permisos
      const userForToken = {
         id,
         uUsername,
         kind: kind,
      };
      const token = jwt.sign(
         userForToken,
         process.env.JWT_SECRET
      );

         
      const lastSeen = new Date();
      user.lastSeen = lastSeen;
      await user.save();

      // Data que mando para guardarla en el front
      resp.status(201).json({
         message: 'Login successful',
         id,
         kind,
         token,
         rest
      });


      
   } catch (err) {
      next(err);
   }
});


// Verificar el token que el usuario tiene en local storage
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
      
         // Esta ruta se aplica cuando recarga la pagina,
         // por lo tanto, actualiza la ultima conexión
         const lastSeen = new Date();
         await User.findByIdAndUpdate(decodedToken.id, { lastSeen });

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
