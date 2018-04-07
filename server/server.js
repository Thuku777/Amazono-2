

const express = require('express'),
morgan = require('morgan'),
bodyparser = require('body-parser'),
mongoose = require('mongoose'),
cors=require('cors');
var config = require('./config')
const route = require('./routes/account')

var app = express();

app.use(bodyparser.json())
app.use(bodyparser.urlencoded({extended: false}))

app.use(morgan('dev'))


app.get('/',(req,res,next)=>{
    res.json({
        hello: 'this is to say hi'
    })
})


app.use(cors());
app.use('/api/account',route);


mongoose.connect('mongodb://asifgptwo:727_7April@ds247058.mlab.com:47058/asifgpfirst',(err)=>{
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



