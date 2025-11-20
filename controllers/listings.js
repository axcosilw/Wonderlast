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
    //multer for
    let url=req.file.path;
    let filename=req.file.filename;
   // console.log(url,"..",filename);
        const newListing=new Listing(req.body.listing);//instance
        //below line to add owner to our lising using passport prop of saving user info in req.user
        newListing.owner=req.user._id;
        newListing.image={url,filename};
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
    let orignalImageUrl=listing.image.url;
    orignalImageUrl=orignalImageUrl.replace("/upload","/upload/w_250");
    res.render("listings/edit.ejs",{listing,orignalImageUrl});
    //res.redirect("/listings/:id");
}

//.update route callback
module.exports.updateListing=async(req,res)=>{
      let {id}=req.params;
      let listing= await Listing.findByIdAndUpdate(id,{...req.body.listing});

    //updation of image
    if(typeof req.file!="undefined"){
        let url=req.file.path;
        let filename=req.file.filename;
        listing.image={url,filename};
        await listing.save();
    }
     

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