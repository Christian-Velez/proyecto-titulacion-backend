const handleErrors = require('../middlewares/handleErrors');
//const userExtractor = require('../middlewares/userExtractor');s
const companyRouter = require('express').Router();
const CompanyUser = require('../models/CompanyUser');

// Obtener la info de 1 empresa
companyRouter.get(
   '/:id',
   async (req, resp, next) => {
      try {
         const { id } = req.params;

         const companyUser = await CompanyUser.findById(id)
               .populate('mostReqTechnology')
               .populate('jobs')
               .populate('toHire.candidate')
               .populate('employees.employee');

         resp.status(200).json({
            message: 'Usuario encontrado',
            companyInfo: companyUser,
         });
      } catch (err) {
         next(err);
      }
   }
);

companyRouter.use(handleErrors);

module.exports = companyRouter;
