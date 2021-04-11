var passport = require('passport');
var LocalStrategy = require('passport-local'),Strategy;
var Seller=require('../model/seller');

module.exports.authenticate=()=>{
    passport.use('local-seller',new LocalStrategy({usernameField : 'email'},
        function(email, password, done) {
            console.log('seller : In authenticate Method');
            if(email==null)
                throw "error";
            Seller.getSellerByEmail(email,function(err,user){
                if(err)throw err;
                if(!user){
                    return done(null,false,{message:"unknown user"});
                }
                Seller.comparePassword(password,user.password,function(err,isMatch){
                    if(err)throw err;
                    if(isMatch){
                        console.log("match")
                        return done(null,user);
                    }else{
                        return done(null,false,{message:"Incorrect password"});
                    }
                });
            });
        }
    ));
}

passport.serializeUser(function(user, done) {
    console.log("serialize "+user);
    done(null, user.id);
});
  
passport.deserializeUser(function(id, done) {
    console.log(id);
    Seller.getSellerById(id, function(err, user) {
        done(err, user);
    });
});