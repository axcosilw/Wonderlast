module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        req.flash("error","You must log in to access listing!!");
        return res.redirect("/login")
}
    next();
}