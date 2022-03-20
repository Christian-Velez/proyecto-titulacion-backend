



const searchRouter = require('express').Router();
const handleErrors = require('../middlewares/handleErrors');
//const userExtractor = require('../middlewares/userExtractor');


const CompanyUser = require('../models/CompanyUser');
const DeveloperUser = require('../models/DeveloperUser');

searchRouter.post('/developers', async(req, resp, next) => {
   try {

      let { technology, minYears, maxYears, minAge, maxAge } = req.body;


      let query;

      if(technology === 'all') {
         query = {
            'technologies': {
               $elemMatch: {
                  yearsOfExperience: {
                     $gte: minYears,
                     $lte: maxYears
                  }
               }
            },
            age: {
               $gte: minAge,
               $lte: maxAge,
            }
         };
      } else {
         query = {
            'technologies': {
               $elemMatch: {
                  technology,
                  yearsOfExperience: {
                     $gte: minYears,
                     $lte: maxYears
                  }
               }
            },
            age: {
               $gte: minAge,
               $lte: maxAge,
            }
         };
      }

      const options = {
         id: 1,
         img: 1,
         lastSeen: 1,
         location: 1,
         age: 1,
         name: 1
      };


      const developerUsers =
         await DeveloperUser.find(
            query,
            options
         );


      resp.status(200).json({
         Mensaje: 'Usuarios encontrados',
         developers: developerUsers
      });

   } catch(err) {
      next(err);
   }
});


searchRouter.post('/companies', async(req, resp, next) => {
   try {

      let { name, technology, min, max } = req.body;

      let query;

      if(technology === 'all') {
         query = {
            name: {
               '$regex': name,
               '$options': 'i'
            },
            averageYears: {
               $gte: min,
               $lte: max,
            }
         };
      } else {
         query = {
            name: {
               '$regex': name,
               '$options': 'i'
            },
            mostReqTechnology: technology,
            averageYears: {
               $gte: min,
               $lte: max,
            }
         };
      }

      const options = {
         id: 1,
         img: 1,
         lastSeen: 1,
         location: 1,
         name: 1
      };

      const companyUsers = await CompanyUser.find(query, options);



      resp.status(200).json({
         Mensaje: 'Usuarios encontrados',
         companies: companyUsers
      });

   } catch(err) {
      next(err);
   }
});

searchRouter.use(handleErrors);
module.exports = searchRouter;
