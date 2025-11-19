const Listing=require("../models/listings")

//index route callback
module.exports.index=async (req,res)=>{
    const allListings=await Listing.find({})
    res.render("listings/index.ejs",{allListings});
};

//new route callback
module.exports.renderNewForm=async(req,res)=>{
        console.log(req.user);
        res.render("listings/new.ejs");
}


//show route
module.exports.showListing=async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id)
    .populate({
        path:"reviews"
        ,populate:{
            path:"author"
        },
    })
    .populate("owner");
   //console.log(listing);
    if(!listing){
         req.flash("error","Listing you requested for does not exist!");
         res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listing})
}

//create route callback
module.exports.createListing=async(req,res,next)=>{
        let result=listingSchema.validate(req.body);
        console.log(result);
        if(result.error){
            console.log(result.error);
            throw new ExpressError(404,result.error);
            
        }
        const newListing=new Listing(req.body.listing);//instance
        
        //below line to add owner to our lising using passport prop of saving user info in req.user
        newListing.owner=req.user._id;
        await newListing.save();
        req.flash("success","New listing added!!");
        res.redirect("/listings");
}

//edit route callback
module.exports.renderEditForm=async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested for does not exist!");
        res.redirect("/listings");

    }
    res.render("listings/edit.ejs",{listing});
    //res.redirect("/listings/:id");
}

//.update route callback
module.exports.updateListing=async(req,res)=>{
      let {id}=req.params;
      await Listing.findByIdAndUpdate(id,{...req.body.listing});
      req.flash("success","Listing Updated!");
      res.redirect(`/listings/${id}`);
}

//delete route callback
module.exports.destroyListing=async(req,res)=>{
    let {id}=req.params;
    let deletedListing=await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","Listing deleted!")
    res.redirect("/listings");
}