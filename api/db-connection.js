require('dotenv').config();
const mongoose = require('mongoose');

module.exports = () => {
    // connecting mongoose with our database
    // connection string will be received from .env file
    mongoose.connect(process.env.DB_CONNECTION_STRING, {
        useCreateIndex: true,
        useNewUrlParser: true,
        poolSize: 5,
        useUnifiedTopology: true
    })
        .then(db => console.log('Connected with MongoDB.'))
        .catch(err => console.log(`Unable to connect with MongoDB: ${err.message}`));
}