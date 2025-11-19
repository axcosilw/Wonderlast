const User=require("../models/user.js")

//signup route callback
module.exports.renderSignupForm=(req,res)=>{
    res.render("users/signup.ejs")
}
module.exports.signupUser=async(req,res)=>{
    try{
      let {username,email,password}=req.body;
       const newUser=new User({email,username});
       const registerdUser= await User.register(newUser,password);
       //console.log(registerdUser);
       req.login(registerdUser,(err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","welcome to WanderLast");
        res.redirect("/listings");
       })
       

    }catch(err){
        req.flash("error",err.message)
        res.redirect("/signup");
    }}


//login route- callback
module.exports.renderLoginForm=(req,res)=>{
    res.render("users/login.ejs");
}

module.exports.loginUser=async(req,res)=>{
   // res.send("working");
    await req.flash("success","welcome back to wonderlast ");
    let redirectUrl= await res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
}

//logout
module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","you have logged out!")
        res.redirect("/listings");
    })
}