const express=require("express");
const router=express.Router();
const User=require("../models/user.js")
const wrapAsync=require("../utils/wrapAsync.js")
const passport=require("passport");
const LocalStrategy=require("passport-local");
const {saveRedirectUrl}=require("../middleware.js")
const userController=require("../controllers/users.js")

//signup
router.route("/signup")
.get(userController.renderSignupForm)
.post(wrapAsync(userController.signupUser));

//login
router.route("/login")
.get(userController.renderLoginForm)
.post(
    saveRedirectUrl,
    passport.authenticate("local",
        {failureRedirect:'/login',
        failureFlash:true}),wrapAsync(userController.loginUser));

//logout
router.get("/logout",userController.logout);

module.exports=router;



// //1signup
// router.get("/signup",userController.renderSignupForm)
// router.post("/signup",wrapAsync(userController.signupUser));

// //2.login
// router.get("/login",userController.renderLoginForm);
// router.post("/login",
//     saveRedirectUrl,
//     passport.authenticate("local",
//         {failureRedirect:'/login',
//         failureFlash:true}),wrapAsync(userController.loginUser));


// //3.logout
// router.get("/logout",userController.logout);


