module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        //saving redirect orignalurl
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","You must log in to access listing!!");
        return res.redirect("/login")
};
    next();
};

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
};