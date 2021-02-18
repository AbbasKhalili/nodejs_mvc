const express = require('express');
const mongoose = require('mongoose');
require('dotenv/config');
const bodyParser = require('body-parser');
const errorHandling = require('./errors/ErrorHandling');

const app = express();


app.use(bodyParser.json());

const personRoute = require('./routes/personRoute');
app.use('/person',personRoute);

app.use(express.static("public"));
app.set("views","views");
app.set("view engine","hbs");

app.get('/',(req,res)=> {
    res.render('index',{title:"We Are Coming Soon..."});
});


mongoose.connect(
    process.env.DB_CONNECTION,
    {useNewUrlParser:true,useUnifiedTopology: true},a=>{});

app.use(errorHandling);
app.listen(3000,'',a=>{});