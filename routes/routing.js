const express = require('express')
var bodyParser = require('body-parser')
var urlencodedParser = bodyParser.urlencoded({ extended: false })
const route = express.Router();
const fromModule = require("../modules/password")
route.get('/',fromModule.homepage)
route.post('/passwordreset',fromModule.passwordReset)
route.get('/:id/string',fromModule.Verify)
route.post('/:id/string',urlencodedParser,fromModule.Passwordchanged)

module.exports = route