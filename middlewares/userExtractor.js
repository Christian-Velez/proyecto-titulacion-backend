const jwt = require('jsonwebtoken');



// Este middleware extrae el userId y el RANGO del json web token
module.exports = (req, resp, next) => {

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


   if(!token || !decodedToken.id) {
      return resp.status(401).json({
         'Message': 'Token missing or invalid'
      });
   }

   // Saco el id y el rango del token y lo mando en el req
   const { id: userId, kind } = decodedToken;
   req.userId = userId;
   req.kind = kind;


   next();
};