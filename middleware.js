const Listing=require("./models/listings");
const {listingSchema}=require("./schema.js");
const ExpressError=require("./utils/ExpressError.js");
const {reviewSchema}=require("./schema.js");
const Review=require("./models/review.js");

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


//midleware for authorisation of owner
module.exports.isOwner=async (req,res,next)=>{
      let {id}=req.params;
      let listing = await Listing.findById(id);
      if(!listing.owner.equals(res.locals.currUser._id)){
        req.flash("error","You are not the owner of this listing!")
        return res.redirect(`/listings/${id}`);
    }
    next();
}


//validating my listing for server side -create route
module.exports.validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
        if(error){
            let errMsg=error.details.map((el)=>el.message).join(",")
            throw new ExpressError(404,errMsg);
        }else{
            next();
        }

};

//validating reviiew for server side -review post route
module.exports.validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
        if(error){
            let errMsg=error.details.map((el)=>el.message).join(",")
            console.log(error);
            throw new ExpressError(404,errMsg);
        }else{
            next();
        }

};

//
module.exports.isReviewAuthor=async (req,res,next)=>{
      let {id,reviewId}=req.params;
      let listing = await Review.findById(reviewId);
      if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error","You are not the author of this review!")
        return res.redirect(`/listings/${id}`);
    }
    next();
}
