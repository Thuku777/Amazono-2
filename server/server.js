

const express = require('express'),
morgan = require('morgan'),
bodyparser = require('body-parser'),
mongoose = require('mongoose'),
cors=require('cors');
var config = require('./config')
const mainRoute = require('./routes/main')
const userRoute = require('./routes/account')
const sellerRoute = require('./routes/seller')

var app = express();

app.use(bodyparser.json())
app.use(bodyparser.urlencoded({extended: false}))

app.use(morgan('dev'))

app.use(cors());

/*
/api/categories
/api/categories/:id

/api/account/signup
/api/account/login
/api/account/profile
/api/account/address

/api/seller/products
/api/seller/products/:id
/api/seller/category/:id
*/
app.use('/api',mainRoute);
app.use('/api/account',userRoute);
app.use('/api/seller',sellerRoute);


mongoose.connect(config.databaseURL,(err)=>{
    if(err){
        console.log('[Error]: MongoDB Connection')
        console.log(err.message)
    }else{
        console.log('[Success]: MongoDB Connection')
    }
})


app.listen(config.port,err=>{
    if(err){
        console.log('[Error]: Server Startup Failed')
    }else{
        console.log('[Success]: Server Startup Successful')
        console.log('[Success]: Sever Running At Port:'+config.port);
    }
})



