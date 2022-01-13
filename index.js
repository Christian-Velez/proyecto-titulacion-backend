// .env
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors());




// Mongo
require('./mongo');
require('./models/Job');
require('./models/Softskill');
require('./models/Technology');
require('./models/CompanyUser');


// Controllers
const loginRouter = require('./controllers/login');
const registerRouter = require('./controllers/register');
const technologyRouter = require('./controllers/technology');
const softSkillRouter = require('./controllers/softskill');
const developerRouter = require('./controllers/developer');
const companyRouter = require('./controllers/company');
const jobRouter = require('./controllers/jobs');



// Middleware
app.use((request, response, next) => {
   console.log('Body: ', request.body);

   next();

   // Despues de estar aqui, pasa al siguiente check / endpoint
});


// Inicio
app.get('/', (req, resp) => {
   resp.send('<h1> Backend de mi aplicacion </h1>');
});

// Auth
app.use('/api/login', loginRouter);
app.use('/api/register', registerRouter);

// Admin
app.use('/api/technology', technologyRouter);
app.use('/api/softskill', softSkillRouter);

//Developer
app.use('/api/developer', developerRouter);

// Company
app.use('/api/company', companyRouter);


// Jobs
app.use('/api/jobs', jobRouter);





const PORT = 3006;

app.listen(PORT, () => {
   console.log('App running on port ' + PORT);
});


