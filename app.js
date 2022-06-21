const express = require('express');
const bodyParser = require('body-parser');
// initialize our express app
const app = express();
const dotenv = require('dotenv')
dotenv.config();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// the port we will be using for access
let port = 3030;
if (process.env.SERVER_PORT != undefined) {
    port = process.env.SERVER_PORT
}

// This Sets up mongoose connection
const mongoose = require('mongoose');
// this requires our mongoose schema
require('./Models/account.model');

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MongoURI, { useNewUrlParser: true });

let db = mongoose.connection;
// test MongoDB connection
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
// This Sets up mongoose connection
let accountDB = db.collection("accounts");


// Imports routes for the products
const account = require('./Routes/account.route');

app.use('/account', account);

app.listen(port, () => {
    console.log('Server is up and running on port number ' + port);
    console.log(
    accountDB != null ?
    accountDB.name + " database found" :
    accountDB.name + " database not found"
);
});
