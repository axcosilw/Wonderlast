if(process.env.NODE_ENV!="production"){
    require('dotenv').config();
}
//console.log(process.env.SECRET);

const express=require("express");
const app=express();
const mongoose=require("mongoose");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const ExpressError=require("./utils/ExpressError.js");
const session=require("express-session");
const MongoStore=require("connect-mongo");
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js")
// const {listingSchema,reviewSchema}=require("./schema.js");
// const Review=require("./models/review.js");
// const wrapAsync=require("./utils/wrapAsync.js");
// const Listing=require("./models/listings.js");




const listingRouter=require("./routes/listing.js");
const reviewRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js")



//const MONGO_URL="mongodb://127.0.0.1:27017/wonderlast"

//CONNECTING MONGOOSE WITH ATLAS DATABASE
const dbUrl=process.env.ATLASDB_URL;
async function main(){
    await mongoose.connect(dbUrl);
};
main().then(()=>{
    console.log("CONNECTED WITH MONGODB")
}).catch((err)=>{
    console.log(err);
})


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"public")));


//mongostore:-
const store=MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:"mysupersecretcode"
    },
    touchAfter:24*3600
})

store.on("error",(err)=>{
    console.log("ERROR IN MONGO SESSION STORE",err);
})


//session
const sessionOptions={
    store:store,
    secret:"mysupersecretcode",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true
    }
};


//1.root route
// app.get("/",(req,res)=>{
//     res.send("working");
// });


app.use(session(sessionOptions));
app.use(flash());

//passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//locals-defined through this-success,error are locals
app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
})


//demouser
// app.get("/demouser",async (req,res)=>{
//     let fakeUser=new User({
//         email:"student2@gmail.com",
//         username:"delta2-student"
//     });

//     let registerdUser=await User.register(fakeUser,"helloshona");
//     res.send(registerdUser);
// })


//express-router
app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);



//upr agr kisi incoming req k sth match nhi hua then below one works
app.all(/.*/, (req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});

//error handling middleware
//1.create route
app.use((err,req,res,next)=>{
    let {statusCode=500,message="some error occured!"}=err;
    res.status(statusCode).send(message);

})

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log("SERVER IS LISTENING ON", port);
});






//2.testting our model
// app.get("/testListing",async(req,res)=>{
//     let Listings= new Listing({
//         title:"my home",
//         description:"by the beach",
//         price:1200,
//         location:"goa",
//         country:"BHARAT"
//     });

//     await Listings.save();
//     console.log("sample was saved:",Listings);
//     res.send("succesful testing");

// });


// //validating my listing for server side -create route
// const validateListing=(req,res,next)=>{
//     let {error}=listingSchema.validate(req.body);
//         if(error){
//             let errMsg=error.details.map((el)=>el.message).join(",")
//             throw new ExpressError(404,errMsg);
//         }else{
//             next();
//         }

// };

//validating reviiew for server side -review post route
// const validateReview=(req,res,next)=>{
//     let {error}=reviewSchema.validate(req.body);
//         if(error){
//             let errMsg=error.details.map((el)=>el.message).join(",")
//             console.log(error);
//             throw new ExpressError(404,errMsg);
//         }else{
//             next();
//         }

// };




// //2.index route
// app.get("/listings",
//     wrapAsync(async (req,res)=>{
//     const allListings=await Listing.find({})
//     res.render("listings/index.ejs",{allListings});
// }));


// //4. new route
// app.get("/listings/new",
//     wrapAsync(async(req,res)=>{
//     res.render("listings/new.ejs");
// }));

// //3.show route
// app.get("/listings/:id" ,
//     wrapAsync(async(req,res)=>{
//     let {id}=req.params;
//     const listing=await Listing.findById(id).populate("reviews");
//     res.render("listings/show.ejs",{listing})
// }));

// app.post('/chats',(req,res)=>{
//     let {from,to,msg}=req.body;//yha s urlencoded wali line likhi h parse krane k lie
//     let newChat=new Chat({
//         from:from,
//         to:to,
//         msg:msg,
//         created_at:new Date()
//     });
//     newChat.save().then((res)=>{"chat was saved"}).catch((err)=>{console.log(err)})
//     res.redirect("/chats");

//     }
// );

// //4.(b)create route
// app.post("/listings",validateListing,
//     wrapAsync(async(req,res,next)=>{
//         let result=listingSchema.validate(req.body);
//         console.log(result);
//         if(result.error){
//             console.log(result.error);
//             throw new ExpressError(404,result.error);
            
//         }
//         const newListing=new Listing(req.body.listing);//instance
//         await newListing.save();
//         res.redirect("/listings");
// })
// );
    //olderway
    //let {title,description,image,price,location,country}=req.body;
    // let newListing=new Listing({
    //     title:title,
    //     description:description,
    //     price:price,
    //     location:location,
    //     country:country
    // });
    // newListing.save().then((res)=>{"listing was saved"}).catch((err=>{console.log(err);}))
    // res.redirect("/listings");


// //5.edit route
// app.get("/listings/:id/edit",
//     wrapAsync(async(req,res)=>{
//     let {id}=req.params;
//     const listing=await Listing.findById(id);
//     res.render("listings/edit.ejs",{listing});
//     //res.redirect("/listings/:id");
// }));


// //5.(b)update route
// app.put("/listings/:id",validateListing,
//     wrapAsync(async(req,res)=>{
//       let {id}=req.params;
//       await Listing.findByIdAndUpdate(id,{...req.body.listing});
//       res.redirect(`/listings/${id}`);
// }));

// //6.DELETE ROUTE
// app.delete("/listings/:id",
//     wrapAsync(async(req,res)=>{
//     let {id}=req.params;
//     let deletedListing=await Listing.findByIdAndDelete(id);
//     console.log(deletedListing);
//     res.redirect("/listings");
// }));

//7.reviews -
// //1.post route review
// app.post("/listings/:id/reviews",validateReview,
//     wrapAsync(async(req,res)=>{
//        let listing=await Listing.findById(req.params.id);
//        let newReview=new Review(req.body.review);

//        listing.reviews.push(newReview);
//        await newReview.save();
//        await listing.save();

//     //    console.log("new review saved");
//     //    res.send("new review saved");
//     res.redirect(`/listings/${listing._id}`)
//   }));

// //2.delete review route
// app.delete("/listings/:id/reviews/:reviewId",
//     wrapAsync(async(req,res)=>{
//         let{id,reviewId}=req.params;
//         await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})

//         //deleting review id from review array of listings 
//         await Review.findByIdAndDelete(reviewId);
//         res.redirect(`/listings/${id}`);

//     })
// )




