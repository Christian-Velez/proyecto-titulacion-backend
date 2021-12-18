require('dotenv').config();
require('./mongo');

const express = require('express');
const cors = require('cors');


// Controllers
const loginRouter = require('./controllers/login');
const registerRouter = require('./controllers/register');
const technologyRouter = require('./controllers/technology');
const softSkillRouter = require('./controllers/softskill');

const app = express();
app.use(express.json());
app.use(cors());

// Middleware
app.use((request, response, next) => {
   console.log('Body: ', request.body);

   next();

   // Despues de estar aqui, pasa al siguiente check / endpoint
});



app.get('/', (req, resp) => {
   resp.send('<h1> Backend de mi aplicacion </h1>');
});



app.use('/api/login', loginRouter);
app.use('/api/register', registerRouter);
app.use('/api/technology', technologyRouter);
app.use('/api/softskill', softSkillRouter);





const PORT = 3006;

app.listen(PORT, () => {
   console.log('App running on port ' + PORT);
});


