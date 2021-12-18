const ERROR_HANDLERS = {
   MongoServerError: (res, { name, message }) =>
      res.status(401).send({ name, message }),

   JsonWebTokenError: (res, {name, message}) => res.status(401).send( { name, message}),

   defaultError: (res) => res.status(500).end(),
};

module.exports = (error, req, resp, _) => {
   console.log(error.name);
   console.log(error.message);
   const handler =
      ERROR_HANDLERS[error.name] ||
      ERROR_HANDLERS.defaultError;

   handler(resp, error);
};
