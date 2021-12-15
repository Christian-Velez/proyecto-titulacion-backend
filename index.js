require('dotenv').config();
require('./mongo');

const express = require('express');
const cors = require('cors');


// Controllers
const loginRouter = require('./controllers/login');
const registerRouter = require('./controllers/register');


const app = express();
app.use(express.json());
app.use(cors());

app.get('/', (req, resp) => {
   resp.send('<h1> Backend de mi aplicacion </h1>');
});



app.use('/api/login', loginRouter);
app.use('/api/register', registerRouter);






const PORT = 3006;

app.listen(PORT, () => {
   console.log('App running on port ' + PORT);
})


