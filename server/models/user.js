
const mongoos = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const crypto = require('crypto');
const Schema = mongoos.Schema;


const userSchema = new Schema({
    email: {type: String, unique: true, lowercase: true, required: true},
    name: String,
    password: String,
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
    isSeller: {
        type: Boolean,
        default: false
    },
},{timestamps: true});

userSchema.pre('save',next =>{
    /*
    var user = this;

    if(!user.isModified('password')) return next();

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

userSchema.methods.comparePassword = (password,user)=>{
//    return bcrypt.compareSync(password,user.password);
    return password==user.password;
}

userSchema.methods.gavatar = (size)=>{
    if(!this.size) size = 200;
    if(!this.email) return 'https://gravatar.com/avatar/?s'+size+'&d=retro';
    
    md5 = crypto.createHash('md5').update(this.email).digest('hex');
    return 'https://gravatar.com/avatar/'+md5+'?s'+size+'&d=retro';
}

var User = mongoos.model('User', userSchema);
module.exports=User;


