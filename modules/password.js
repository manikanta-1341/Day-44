const mongo = require('../shared/connect')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const mailer = require('nodemailer')
const {ObjectId} = require('mongodb')


module.exports.homepage = async (req, res, next) => {
    try{
        res.send({msg:"started successfully"})
    }
    catch(err){
        res.send(err)
    }
}

module.exports.passwordReset = async (req, res, next) => {
    try {
        // console.log("in password reset func", req.body.email);
        const email = req.body.email
        const user = await mongo.db.collection('users').findOne({ email: email })
        // console.log(user)
        if (user) {
            const randomString = await bcrypt.genSalt(5)
            const token = jwt.sign({str:randomString},'secret_key',{ expiresIn: "10m"})
            // console.log(randomString,user)
            await mongo.db.collection('users').updateOne({_id : user._id},{$set:{rndString : token}})
            var transporter = mailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'tt8632965@gmail.com',
                    pass: 'tt8632965@123'
                }
            });
            let info = await transporter.sendMail({
                from: 'tt8632965@gmail.com', // sender address
                to: "medicharlamanikanta13@gmail.com", // list of receivers
                subject: "Password Reset", // Subject line
                text: `https://day-44.herokuapp.com/${user._id}/string/?s=${token}` // plain text body
            }, function (error, info) {
                if (error) {
                    console.log(error);
                }
            });
            res.status(200).send("Matched")
        }
        else {
            res.send("not matched")
        }
    }
    catch (err) {
        // console.log(err)
        res.send("failed")
    }

}

module.exports.Verify = async (req, res, next)=>{
    // console.log("in verify")
    try{
        const user = await mongo.db.collection('users').findOne({_id : ObjectId(req.params.id)})
        const tokenfromurl = req.query.s
        var decodeToken = jwt.decode(req.query.s)
        if(tokenfromurl === user.rndString) {
            if(decodeToken.exp*1000  >=Date.now()){
                res.render('resetform')
            }
            else{
                res.send("<h1>link expired</h1>")
            }
        }
        else{
            res.send("<h2>Invalid token</h2>")
        }
    }
    catch(err){
        res.send(err)
    }

}

module.exports.Passwordchanged = async (req, res, next) => {
    // console.log("in password changed")
    try{
        const salt = await bcrypt.genSalt(6)
        req.body.Password = await bcrypt.hash(req.body.Password,salt)
        let response = await mongo.db.collection('users').updateOne({_id:ObjectId(req.params.id)},{$set:{password:req.body.Password}})
        
        if(response){
            res.render('success')
        }
    }
    catch(err){
        console.log(err)
        res.send(err)
    }
}
