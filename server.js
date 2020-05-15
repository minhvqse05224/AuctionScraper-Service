const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose')

require ('dotenv').config();
 
const app = express();
const port = process.env.PORT || 6969;

app.use(cors());
app.use(express.json());

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, {useNewUrlParser : true, useCreateIndex : true});
const connection = mongoose.connection;
connection.once('open', () =>{
    console.log("MongoDB db conn established successfully");
}).on('error', function(error){
    console.log('Error is: ', error);
});

 const itemsRouter = require('./routes/items');
 const sitesRouter = require('./routes/sites')

 app.use('/items', itemsRouter);
 app.use('/sites',sitesRouter);

app.listen(port, () => {
    console.log('Server running on port : '+port);
})