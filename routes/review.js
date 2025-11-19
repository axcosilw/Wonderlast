const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js");
const {reviewSchema}=require("../schema.js");
const Review=require("../models/review.js");
const Listing=require("../models/listings.js");
const {isLoggedIn, isOwner,validateReview,isReviewAuthor}=require("../middleware.js")
const User=require("../models/user.js");

const reviewController=require("../controllers/reviews.js")

//1.post route review
router.post("/",isLoggedIn,validateReview, wrapAsync(reviewController.postReview));

//2.delete review route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor, wrapAsync(reviewController.destroyReview));

module.exports=router;