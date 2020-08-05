module.exports={
    ensureAuthenticated: function(req,res,next){
        if(req.isAuthenticated()){
            return next()
        }
        req.flash('error_msg','Please log in to view this resource');
        res.redirect('/users/login')
    },

    ensureGuest: function(req,res,next){
        if(req.isAuthenticated()){
            req.flash('error_msg','You are already logged in');
            res.redirect('/dashboard')
            
        }
        return next()
    }
}