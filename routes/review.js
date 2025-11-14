const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const {reviewSchema}=require("../schema.js");
const Review=require("../models/review.js");
const Listing=require("../models/listings.js");

//validating reviiew for server side -review post route
const validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
        if(error){
            let errMsg=error.details.map((el)=>el.message).join(",")
            console.log(error);
            throw new ExpressError(404,errMsg);
        }else{
            next();
        }

};

//1.post route review
router.post("/",validateReview,
    wrapAsync(async(req,res)=>{
        console.log(req.params.id);
       let listing=await Listing.findById(req.params.id);
       let newReview=new Review(req.body.review);

       listing.reviews.push(newReview);
       await newReview.save();
       await listing.save();

    //    console.log("new review saved");
    //    res.send("new review saved");
    res.redirect(`/listings/${listing._id}`)
  }));

//2.delete review route
router.delete("/:reviewId",
    wrapAsync(async(req,res)=>{
        let{id,reviewId}=req.params;
        await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})

        //deleting review id from review array of listings 
        await Review.findByIdAndDelete(reviewId);
        res.redirect(`/listings/${id}`);

    })
);

module.exports=router;