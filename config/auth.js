module.exports ={
    ensureAuthenticated: function(req,res,next){
        if(req.ensureAuthenticated()){
            return next();
        }
        req.flash('error_msg','Please log in to view to this resourse')
        res.redirect('/login');
    }
}