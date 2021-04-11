var mongoose=require('mongoose');
var bcrypt=require('bcryptjs');
var uniqueValidator = require('mongoose-unique-validator');

var AdminSchema = mongoose.Schema({
    email:{
        type:String,
        index:true,
        unique:true
    },
    adminName:{
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
    adminViewPrivilege:{
        type:Boolean
    },
    adminCrudPrivilege:{
        type:Boolean
    },
    sellerViewPrivilege:{
        type:Boolean
    },
    sellerCrudPrivilege:{
        type:Boolean
    },
    productViewPrivilege:{
        type:Boolean
    },
    productCrudPrivilege:{
        type:Boolean
    },
    token:{
        type:String
    },
    emailVerified:{
        type:Boolean
    }
});
AdminSchema.plugin(uniqueValidator);
var Admin=module.exports=mongoose.model('Admin',AdminSchema);

module.exports.createAdmin=(newAdmin,callback)=>{
    newAdmin.save(callback);
}

module.exports.getAdminEmail=(token,callback)=>{
    var query={token:token};
    Admin.findOne(query,callback);
}

module.exports.setPassword=(password,token,callback)=>{
    bcrypt.genSalt(10, (err, salt)=> {
        bcrypt.hash(password, salt, (err, hash)=> {
            var query={token:token};
            var verify={password:hash,emailVerified:true};
            Admin.findOneAndUpdate(query,verify,callback);
        });
    });
}

module.exports.checkEmail=function(email,callback){
    var query={email:email};
    Admin.countDocuments(query,callback);
}

module.exports.getAdminByEmail=function(email,callback){
    var query={email:email};
    Admin.findOne(query,callback);
}

module.exports.getAdminById=function(id,callback){
    Admin.findById(id,callback);
    console.log("Admin");
}

module.exports.getAdmins=(id,callback)=>{
    var query={_id:{$ne:id}};
    Admin.find(query,callback);
}

module.exports.updateToken=(email,token,callback)=>{
    var query={email:email};
    var update={token:token};
    Admin.findOneAndUpdate(query,update,callback);
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

module.exports.changePassword=(id,password,callback)=>{
    bcrypt.genSalt(10, (err, salt)=> {
        bcrypt.hash(password, salt, (err, hash)=> {
            var query={_id:id};
            var change={password:hash};
            Admin.findOneAndUpdate(query,change,callback);
        });
    });
}

module.exports.comparePassword=function(canidatePassword,hash,callback){
    bcrypt.compare(canidatePassword, hash, function(err, isMatch) {
        if(err)throw err;
        callback(null,isMatch);
    });
}
