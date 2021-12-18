const bcrypt = require('bcrypt');
const handleErrors = require('../middlewares/handleErrors');
const AdminUser = require('../models/AdminUser');
const CompanyUser = require('../models/CompanyUser');
const DeveloperUser = require('../models/DeveloperUser');



const registerRouter = require('express').Router();


registerRouter.post('/', async (req, res, next) => {
   try {
      const { body } = req;
      const { kind, password, ...rest } = body;

      const saltRounds = 10;
      const passwordHash = await bcrypt.hash(password, saltRounds);

      let newUser;
      if(kind === 'Developer') {
         newUser = new DeveloperUser({ ...rest, passwordHash });
      }

      if(kind === 'Company') {
         newUser = new CompanyUser({ ...rest, passwordHash });
      }

      if(kind === 'Admin') {
         newUser = new AdminUser({ ...rest, passwordHash });
      }

      const savedUser = await newUser.save();
      
      res.status(201).json( savedUser );
   }
   catch(err) {
      next(err);
   }
});


registerRouter.use(handleErrors);










module.exports = registerRouter;

