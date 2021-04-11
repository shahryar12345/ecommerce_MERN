var passport = require('passport');
var LocalStrategy = require('passport-local'),Strategy;
var Buyer=require('../model/buyer');

module.exports.authenticate=()=>{
    passport.use('local-buyer',new LocalStrategy({usernameField : 'email'},
        function(email, password, done) {
            console.log('Buyer');
            if(email==null)
                throw "error";
            Buyer.getBuyerByEmail(email,function(err,user){
                if(err)throw err;
                if(!user){
                    return done(null,false,{message:"unknown user"});
                }
                Buyer.comparePassword(password,user.password,function(err,isMatch){
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
        done(err, user);
    });
});