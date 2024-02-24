const express=require('express');
const expressLayouts =require('express-ejs-layouts');
const mongoose=require('mongoose');
const flash =require('connect-flash')
const session =require('express-session')
const passport =require('passport')
const LocalStrategy = require('passport-local').Strategy;
const passportConfig = require('./config/passport');
const app=express();

//pass

const db= 'mongodb+srv://@cluster0.2hpssfg.mongodb.net/mernstack?retryWrites=true&w=majority';
//connect to mongo;


mongoose.connect(db)
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.log(err));

//EJS
app.use(expressLayouts);
app.set('view engine','ejs');

//bodyparser
app.use(express.urlencoded({ extended: false}));
//express session
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
  
}))
//passport middleware
app.use(passport.initialize());
app.use(passport.session());
passportConfig(passport);

//connect flash
app.use(flash())

//global vars
app.use((req,res,next)=>{
  res.locals.success_msg=req.flash('success_msg')
  res.locals.error_msg=req.flash('error_msg')
  res.locals.error=req.flash('error')
  next();
})


//routes
app.use('/', require('./routes/index'))
app.use('/users', require('./routes/users'))
const PORT=process.env.PORT || 5000;
app.listen(PORT,console.log(`Server started on port ${PORT}`));
