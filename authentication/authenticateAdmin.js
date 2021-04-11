var passport = require('passport');
var LocalStrategy = require('passport-local'),Strategy;
var Admin=require('../model/admin');
var Seller=require('../model/seller');
var Buyer=require('../model/buyer');

module.exports.authenticate=()=>{
    passport.use('local-admin',new LocalStrategy({usernameField : 'email'},
        function(email, password, done) {
            console.log('admin');
            if(email==null)
                throw "error";
            Admin.getAdminByEmail(email,function(err,user){
                if(err)throw err;
                if(!user){
                    return done(null,false,{message:"unknown user"});
                }
                Admin.comparePassword(password,user.password,function(err,isMatch){
                    if(err)throw err;
                    if(isMatch){
                        console.log("match")
                        return done(null,user);
                    }else{
                        return done(null,false,{message:"incorrect password"});
                    }
                });
            });
        }
    ));
}

passport.serializeUser(function(user, done) {
    console.log("serialize");
    done(null, user.id);
});
  
passport.deserializeUser(function(id, done) {
    console.log("deserialize");
    Buyer.getBuyerById(id, function(err, user) {
        if(user){
            done(err, user);
        }else{
            Seller.getSellerById(id,function(err,seller){
                if(seller){
                    done(err,seller);
                }else{
                    Admin.getAdminById(id,function(err,admin){
                        done(err,admin);
                    });
                }
            });
        }
    });    
});