const express=require('express');
const router=express.Router();
const {ensureAuthnticated} =require('../config/auth');
//welcome page
router.get('/',(req,res)=>res.render('welcome'))
//dashboard page
router.get('/dashboard',(req,res)=>res.render('dashboard',{
    name: req.user.name
}))
module.exports=router;