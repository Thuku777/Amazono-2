
const route = require('express').Router();
const jwt = require('jsonwebtoken')

const User = require('../models/user');
const config = require('../config');

const jwtVerify = require('../middlewares/check-jwt');

route.post('/signup',(req,res,next)=>{
    
    let user = new User();
    user.name = req.body.name;
    user.email = req.body.email;
    user.password = req.body.password;
    user.isSeller = req.body.isSeller;
    user.picture = user.gavatar();

    User.findOne({email: req.body.email},(err, existinguser) => {
        if(err){
            res.json({
                success: false,
                message: err
            })
        }else{
            if(existinguser){
                res.json({
                    success: false,
                    message: 'Account with that email already exist'
                })
            }else{
                user.save((err)=>{
                    if(err){
                        res.json({
                            success: false,
                            message: 'Failed to Save: DB Error'
                        })
                        console.log(err);
                    }
                    else{
                        var token = jwt.sign({user: user}, config.secret, {expiresIn: '7d'});
                        res.json({
                            success: true,
                            message: 'Record inserted successfully',
                            token: token
                        })
                    }
                });
            }
        }
    });
});


route.post('/login',(req,res,next)=>{
    User.findOne({ email: req.body.email},(err,user)=>{
        if(err) throw err;
        if(!user){
            res.json({
                success: false,
                message: "User not found"
            });
        }
        else if(user){
            var validPasswd = user.comparePassword(req.body.password,user);
            if(!validPasswd){
                res.json({
                    success: false,
                    message: "Wrong Password, Authentication Failed"
                })
            }else{
                var token = jwt.sign({user: user}, config.secret, {expiresIn: '7d'});
                res.json({
                    success: true,
                    message: 'Login Successful',
                    token: token
                })
            }
        }
    })
});

route.route('/profile')
.get(jwtVerify, (req,res,next)=>{
    User.findOne({_id: req.decoded.user._id},(err, user)=>{
        if(err){
            res.status(500).json({
                success: false,
                message: 'user does not exist'
            });
        }else{
            res.status(200).json({
                success: true,
                message: 'Successfully fetched the user',
                user: user
            });
            next();
        }
    });
})
.post(jwtVerify, (req,res,next)=>{
    console.log(req.body)
    User.findOne({_id: req.decoded.user._id},(err, user)=>{
        if(err){
            res.status(500).json({
                success: false,
                message: 'user does not exist'
            });
        }else{
            if(req.body.name) user.name = req.body.name;
            if(req.body.email) user.email = req.body.email;
            if(req.body.password) user.password = req.body.password;
            if(req.body.picture) user.picture = req.body.picture;

            user.save((err)=>{
                if(err){
                    res.status(503).json({
                        success: false,
                        message: 'Failed to Save user: DB Error',
                        user: user
                    });
                }else{
                    res.status(200).json({
                        success: true,
                        message: 'User infor updated successfully',
                        user: user
                    });
                    next();
                }
            });
        }
    });
})


route.route('/address')
.get(jwtVerify, (req,res,next)=>{
    User.findOne({_id: req.decoded.user._id},(err, user)=>{
        if(err){
            res.status(500).json({
                success: false,
                message: 'user does not exist'
            });
        }else{
            if(user.address && user.address!==null){
                res.status(200).json({
                    success: true,
                    message: 'Successfully fetched the address',
                    address: user.address
                });
                next();
            }else{
                res.status(502).json({
                    success: false,
                    message: 'user has no address',
                });
                next();
            }
        }
    });
})
.post(jwtVerify, (req,res,next)=>{
    User.findOne({_id: req.decoded.user._id},(err, user)=>{
        if(err){
            res.status(500).json({
                success: false,
                message: 'user does not exist'
            });
        }else{
            if(req.body.line1) user.address.line1 = req.body.line1;
            if(req.body.line2) user.address.line2 = req.body.line2;
            if(req.body.line3) user.address.line3 = req.body.line3;
            if(req.body.postalCode) user.address.postalCode = req.body.postalCode;
            if(req.body.city) user.address.city = req.body.city;
            if(req.body.state) user.address.state = req.body.state;
            if(req.body.country) user.address.country = req.body.country;

            user.save((err)=>{
                if(err){
                    res.status(503).json({
                        success: false,
                        message: 'Failed to Save user: DB Error',
                        address: user.address
                    });
                }else{
                    res.status(200).json({
                        success: true,
                        message: 'User infor updated successfully',
                        address: user.address
                    });
                    next();
                }
            });
        }
    });
})


module.exports = route;

