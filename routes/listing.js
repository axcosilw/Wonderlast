const express=require("express");
const router=express.Router();
const Listing=require("../models/listings.js");
const wrapAsync=require("../utils/wrapAsync.js");
const {listingSchema}=require("../schema.js");
const ExpressError=require("../utils/ExpressError.js");




//validating my listing for server side -create route
const validateListing=(req,res,next)=>{
    let {error}=listingSchema.validate(req.body);
        if(error){
            let errMsg=error.details.map((el)=>el.message).join(",")
            throw new ExpressError(404,errMsg);
        }else{
            next();
        }

};


//2.index route
router.get("/",
    wrapAsync(async (req,res)=>{
    const allListings=await Listing.find({})
    res.render("listings/index.ejs",{allListings});
}));


//4. new route
router.get("/new",
    wrapAsync(async(req,res)=>{
    res.render("listings/new.ejs");
}));

//3.show route
router.get("/:id" ,
    wrapAsync(async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id).populate("reviews");
    if(!listing){
         req.flash("error","Listing you requested for does not exist!");
         res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listing})
}));

//4.(b)create route
router.post("/",validateListing,
    wrapAsync(async(req,res,next)=>{
        let result=listingSchema.validate(req.body);
        console.log(result);
        if(result.error){
            console.log(result.error);
            throw new ExpressError(404,result.error);
            
        }
        const newListing=new Listing(req.body.listing);//instance
        await newListing.save();
        req.flash("success","New listing added!!");
        res.redirect("/listings");
})
);


//5.edit route
router.get("/:id/edit",
    wrapAsync(async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested for does not exist!");
        res.redirect("/listings");

    }
    res.render("listings/edit.ejs",{listing});
    //res.redirect("/listings/:id");
}));


//5.(b)update route
router.put("/:id",validateListing,
    wrapAsync(async(req,res)=>{
      let {id}=req.params;
      await Listing.findByIdAndUpdate(id,{...req.body.listing});
      req.flash("success","Listing Updated!");
      res.redirect(`/listings/${id}`);
}));

//6.DELETE ROUTE
router.delete("/:id",
    wrapAsync(async(req,res)=>{
    let {id}=req.params;
    let deletedListing=await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","Listing deleted!")
    res.redirect("/listings");
}));


module.exports=router;