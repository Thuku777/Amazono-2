
const mongoos = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const crypto = require('crypto');
const Schema = mongoos.Schema;


const userSchema = new Schema({
    email: {type: String, unique: true, lowercase: true},
    name: String,
    password: {type: String, unique: false, lowercase: true},
    picture: String,
    address: {
        line1: String,
        line2: String,
        line3: String,
        postalCode: String,
        city: String,
        state: String,
        country: String
    },
    isSeller: Boolean,
    created: {type: Date, required: true, default: Date.now()}
});

userSchema.pre('save',next =>{
    /*
    var user = this;
    if(!user.isModified('password')){
        return next();
    }
    bcrypt.hash(user.password,null,null,function(err,hash){
        if(err) return next(err)
        user.password=hash;
        next();
    });
    */
   next();
})

userSchema.methods.comparePassword = (password)=>{
    return bcrypt.compareSync(password,this.password);
}

userSchema.methods.gavatar = (size)=>{
    if(!this.size) size = 200;
    if(!this.email) return 'http://gravatar.com/avatar/?s'+size+'&d=retro';
    
    md5 = crypto.createHash('md5').update(this.email).digest('hex');
    return 'http://gravatar.com/avatar/'+md5+'?s'+size+'&d=retro';
}

var User = mongoos.model('User', userSchema);
module.exports=User;


