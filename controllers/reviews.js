const Listing=require("../models/listings.js");
const Review=require("../models/review.js");

module.exports.postReview=async(req,res)=>{
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
  }

  module.exports.destroyReview=async(req,res)=>{
          let{id,reviewId}=req.params;
          await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}})
  
          //deleting review id from review array of listings 
          await Review.findByIdAndDelete(reviewId);
          req.flash("success","Review deleted");
          res.redirect(`/listings/${id}`);
  
      }

