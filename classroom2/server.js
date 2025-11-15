const express=require("express");
const app=express();
const users=require("./routes/user.js");
const posts=require("./routes/posts.js");
const session=require("express-session");
const flash=require("connect-flash");
const path=require("path");


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

// const cookieParser=require("cookie-parser");

// //to use cookie parser
// app.use(cookieParser("secretcode"));

// //signed cookie
// app.get("/getsignedcookie",(req,res)=>{
//     res.cookie("mad-in","london",{signed:true});
//     res.send("signed cookie sent")
// })


// app.get("/verify",(req,res)=>{
//     console.log(req.signedCookies);
//     res.send("cookie verified")
// })


// app.get("/getcookies",(req,res)=>{
//     //greet=name of cookie,hello=value of cookie
//     res.cookie("greet","hello");
//     res.cookie("madebharat","yoyo");
//     res.send("sent u some cookies")

// });

// app.get("/greet",(req,res)=>{
//     let {name="anonymous"}=req.cookies;
//     res.send(`hi ${name}`);

// })


// //want to print cookie on root route
// app.get("/",(req,res)=>{
//     console.dir(req.cookies);
//     res.send("root of classroom 2")
// })

// app.use("/users",users);
// app.use("/posts",posts);



const sessionOptions={
    secret:"mysupersecretstring",
    resave:false,
    saveUninitialized:true
};

app.use(session(sessionOptions));
app.use(flash());
app.use((req,res,next)=>{
    res.locals.errorMsg=req.flash("error");
    res.locals.successMsg=req.flash("success")
    next();

})

app.get("/register",(req,res)=>{
    let{name="anonymous"}=req.query;
    req.session.name=name;
   if(name==="anonymous"){
    req.flash("error","user not registered");
   }else{
     req.flash("success","user registered successfully");
   }

    res.redirect("/hello");
})

app.get("/hello",(req,res)=>{
    // res.send(`hllo,${req.session.name}`);

    //when we want to access req.flash.message in an template -pge.ejs
    // res.locals.errorMsg=req.flash("error");
    // res.locals.successMsg=req.flash("success");
    res.render("page.ejs",{name:req.session.name});

})
//2.express session 
// app.get("/reqcount",(req,res)=>{
//     if(req.session.count>0){
//         req.session.count++;
//     }else{
//         req.session.count=1;
//     }
//     res.send(`you sent a request ${req.session.count} times`)
// })


//1.video-to see session id
// app.get("/test",(req,res)=>{
//     res.send("test successfull");
// })
app.listen(3000,()=>{
    console.log("sever is listning to 3000")
})