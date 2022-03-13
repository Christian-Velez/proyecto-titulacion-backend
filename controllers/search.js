



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
         query = {};
      } else {
         query = {
            'technologies.technology': technology,
            'technology.yearsOfExperience': {
               '$gte': minYears,
               '$lte': maxYears
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


      const developerUsers = await DeveloperUser.find(query, options);


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

      //if(technology === 'all') {
         technology = '';
      //}

      const options = {
         id: 1,
         img: 1,
         lastSeen: 1,
         location: 1,
         name: 1
      };

      const companyUsers = await CompanyUser.find({
         name: {
            '$regex': name,
            '$options': 'i'
         }
         //mostReqTechnology: technology,

      }, options);



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
