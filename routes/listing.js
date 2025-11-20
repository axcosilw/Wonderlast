const express=require("express");
const router=express.Router();
const Listing=require("../models/listings.js");
const wrapAsync=require("../utils/wrapAsync.js");
const {listingSchema}=require("../schema.js");
const ExpressError=require("../utils/ExpressError.js");
const {isLoggedIn, isOwner,validateListing}=require("../middleware.js")
const multer = require("multer");
const { storage } = require("../cloudConfig");
const upload = multer({ storage });

const listingController=require("../controllers/listings.js");

// index and create route:
router.route("/")
  .get(wrapAsync(listingController.index))
  .post(
    isLoggedIn,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.createListing)
  );



//4. new route
router.get("/new",isLoggedIn, wrapAsync(listingController.renderNewForm));


//update,show and delete route:-
router.route("/:id")
.put(isLoggedIn,isOwner,upload.single("listing[image]"),validateListing, wrapAsync(listingController.updateListing))
.get( wrapAsync(listingController.showListing))
.delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListing))




// //1.index route
// router.get("/",wrapAsync(listingController.index));


// //4. new route
// router.get("/new",isLoggedIn, wrapAsync(listingController.renderNewForm));

//3.show route
// router.get("/:id" , wrapAsync(listingController.showListing));

// //4.(b)create route
// router.post("/",isLoggedIn,validateListing, wrapAsync(listingController.createListing));


//5.edit route
router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(listingController.renderEditForm));


// //5.(b)update route
// router.put("/:id",isLoggedIn,isOwner,validateListing, wrapAsync(listingController.updateListing));

// //6.DELETE ROUTE
// router.delete("/:id",isLoggedIn,isOwner,wrapAsync(listingController.destroyListing));


module.exports=router;




