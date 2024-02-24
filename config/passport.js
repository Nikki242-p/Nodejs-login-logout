const LocalStrategy =require('passport-local').Strategy;
const mongoose=require('mongoose');
const bcrypt=require('bcryptjs');
const passport = require('passport');


//

const User= require('../models/user');
passport.serializeUser(async (user, done) => {
    try {
      done(null, user.id);
    } catch (error) {
      done(error, null);
    }
  });
  
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });


module.exports=function(passport){
    passport.use(
        new LocalStrategy({ usernameField: 'email'},(email,password,done)=>{
            
            //match user
            User.findOne({email: email})
            .then(user=>{
                if(!user){
                    return done(null,false,{message: 'email is not registered'});
                }
                // match password
                bcrypt.compare(password, user.password,(err,isMatch)=>{
                    if(err) throw err;
                    if(isMatch){
                        return done(null, user)
                    }else{
                        console.log(err);
                        return done(null, false,{message:"Password incorrect"})
                   }
                })

            })
            .catch(err => console.log(err));

        })
    
    );

}