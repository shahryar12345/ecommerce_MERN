var mongoose=require('mongoose');
var bcrypt=require('bcryptjs');
var uniqueValidator = require('mongoose-unique-validator');

var BuyerSchema = mongoose.Schema({
    email:{
        type:String,
        index:true,
        unique:true
    },
    fullName:{
        type:String
    },
    DoB:{
        type:Date
    },
    gender:{
        type:String
    },
    phoneNo:{
        type:Number
    },
    role:{
        type:String
    },
    password:{
        type:String
    },
    token:{
        type:String
    },
    emailVerified:{
        type:Boolean
    }
});
BuyerSchema.plugin(uniqueValidator);
var Buyer=module.exports=mongoose.model('Buyer',BuyerSchema);

module.exports.createBuyer=(newBuyer,callback)=>{
    bcrypt.genSalt(10, (err, salt)=> {
        bcrypt.hash(newBuyer.password, salt, (err, hash)=> {
            newBuyer.password=hash;
            newBuyer.save(callback);
        });
    });
}

module.exports.checkEmail=function(email,callback){
    var query={email:email};
    Buyer.countDocuments(query,callback);
}

module.exports.getBuyerByEmail=function(email,callback){
    var query={email:email};
    Buyer.findOne(query,callback);
}

module.exports.updateToken=(email,token,callback)=>{
    var query={email:email};
    var update={token:token};
    Buyer.findOneAndUpdate(query,update,callback);
}

module.exports.updatePassword=(token,password,callback)=>{
    bcrypt.genSalt(10, (err, salt)=> {
        bcrypt.hash(password, salt, (err, hash)=> {
            var query={token:token};
            var update={password:hash};
            Buyer.findOneAndUpdate(query,update,callback);
        });
    });
}

module.exports.verifyBuyerEmail=(token,callback)=>{
    var query={token:token};
    var verify={emailVerified:true};
    Buyer.findOneAndUpdate(query,verify,callback);
}

module.exports.getBuyerById=function(id,callback){
    Buyer.findById(id,callback);
    console.log("Hello");
}

module.exports.comparePassword=function(canidatePassword,hash,callback){
    bcrypt.compare(canidatePassword, hash, function(err, isMatch) {
        if(err)throw err;
        callback(null,isMatch);
    });
}
