const mongoose = require('mongoose');
const connectionString = process.env.MONGODB_URI_DEV;


mongoose.connect(connectionString)
   .then(() => console.log('Database connected'))
   .catch(() => console.log('No se pudo conectar a mongo'));