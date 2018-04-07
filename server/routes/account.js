
const route = require('express').Router();
const jwt = require('jsonwebtoken')

const User = require('../models/user');
const config = require('../config');

route.post('/signup',(req,res,next)=>{
    let user = new User();
    user.name = req.body.name;
    user.email = req.body.email;
    user.password = req.body.password;
    user.isSeller = req.body.isSeller;
    user.picture = user.gavatar();

    User.findOne({email: req.body.email},(err, existingUser) => {
        if(existingUser){
            res.json({
                success: false,
                message: 'Account with that email already exist'
            })
        }else{
            user.save();
//            var token = jwt.sign({user: user}, config.secret, {expiresIn: '7d'});
            res.json({
                success: true,
                message: 'Record inserted successfully',
//                token: token
            })
        }
    });
});
module.exports = route;



