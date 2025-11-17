const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const {reviewSchema}=require("../schema.js");
const Review=require("../models/review.js");
const Listing=require("../models/listings.js");
const {isLoggedIn, isOwner,validateReview,isReviewAuthor}=require("../middleware.js")
const User=require("../models/user.js");

//1.post route review
router.post("/",isLoggedIn,validateReview,
    wrapAsync(async(req,res)=>{
       console.log(`id of listings id ${req.params.id}`);
       let listing=await Listing.findById(req.params.id);
       let newReview=new Review(req.body.review);
       //adding author with new review
       newReview.author=res.locals.currUser._id;
       console.log(newReview);
       listing.reviews.push(newReview);
       await newReview.save();
       await listing.save();
       req.flash("success","new review created");

    //    console.log("new review saved");
    //    res.send("new review saved");
    res.redirect(`/listings/${listing._id}`)
  }));

//2.delete review route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,
    wrapAsync(async(req,res)=>{
        let{id,reviewId}=req.params;
        await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})

        //deleting review id from review array of listings 
        await Review.findByIdAndDelete(reviewId);
        req.flash("success","Review deleted");
        res.redirect(`/listings/${id}`);

    })
);

module.exports=router;