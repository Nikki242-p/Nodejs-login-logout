const express=require('express');
const router=express.Router();
const bcrypt =require('bcryptjs');
const passport=require('passport')
//user model
const User = require(__dirname + '/../models/user');

//login page

router.get('/login',(req,res)=>res.render('login'))
//register page
router.get('/register',(req,res)=>res.render('register'))
//register handle
router.post('/register',(req,res)=>{
   const { name, email,password,password2}=req.body;
   let errors=[];

   //check required fields
   if(!name || !email || !password || !password2){
    errors.push({msg: 'Please fill all fields'})
   }
   if(password!==password2){
    errors.push({msg: 'Passwords do not match'})
   }
   if(password.length<6){
   errors.push({
    msg:'Weak password'
   })
   }
   if(errors.length>0){
    res.render('register', {
        errors,
        name,
        email,
        password,
        password2 
    });}
    else{
        //valid
        User.findOne({email: email
        })
        .then(user =>{
            if(user){
                errors.push({
                    msg: "email is already registered"
                });
                res.render('register',{
                    errors,
        name,
        email,
        password,
        password2 
                });
            }else{
     const newUser =new User({
        name,
        email,
        password
     })
     newUser.save()
     .then(user => {
        req.flash('success_msg', 'You are now registered and can log in');

         res.redirect('login');
     })
    //  .catch(err => console.log(err))
     
        bcrypt.genSalt(10,(err,salt) =>bcrypt.hash(newUser.password, salt, (err,shash) =>{
            if(err) throw err;
            newUser.password =shash;
            newUser.save()
            .then(user =>{
                res.redirect('/login');
            })
            .catch(err =>console.log(err))
        }))
     
            }
        });
        
    }
    
   

});
//login handle

router.post('/login',(req,res,next)=>{
  passport.authenticate('local',{
    successRedirect:'/dashboard',
    failureRedirect:'/users/login',
    failureFlash:true
  })(req,res,next)
})
//logout handle
router.get('/logout',(req,res)=>{
    req.logout();
    req.flash('success_msg','You are logged off');
    res.redirect('/login')
})

module.exports=router;