const express=require("express");
const router=express.Router();
const User=require("../models/user.js")
const wrapAsync=require("../utils/wrapAsync.js")
const passport=require("passport");
const LocalStrategy=require("passport-local");
const {saveRedirectUrl}=require("../middleware.js")

router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs")
})

router.post("/signup",wrapAsync(async(req,res)=>{
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
    }
    

}));


router.get("/login",(req,res)=>{
    res.render("users/login.ejs");
});

router.post("/login",
    saveRedirectUrl,
    passport.authenticate("local",
        {failureRedirect:'/login',
        failureFlash:true}),
        
async(req,res)=>{
   // res.send("working");
    req.flash("success","welcome back to wonderlast ");
    let redirectUrl=res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
})


router.get("/logout",(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","you have logged out!")
        res.redirect("/listings");
    })
})

module.exports=router;
