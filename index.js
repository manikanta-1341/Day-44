const express = require('express');
const dotenv = require('dotenv');
const mongo = require('./shared/connect')
const cors = require('cors')
const app = express();
const password = require('./routes/routing')
var bodyParser = require('body-parser')
app.use(express.json());
app.use(bodyParser.json())
dotenv.config();
mongo.connect()
app.use(cors())



app.set('view engine', 'ejs')


app.use("/",(req,res, next) =>{
    next();
})


app.use('/',password)


app.listen(process.env.port)