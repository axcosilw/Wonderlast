const mongoose=require("mongoose");
const Schema= mongoose.Schema;
const Review=require("./review.js");

const listingSchema= new Schema({
    title:{
        type:String,
        required:true},

    description:String,

    image:{
           url:String,
           filename:String,
        },

    

    price:Number,
    location:String,
    country:String,
    owner:{
        type:Schema.Types.ObjectId,
        ref:'User',
    },
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review"
        }
    ]
    
});

listingSchema.post("findOneAndDelete", async(listing)=>{
    if(listing){
        let deletedListingReviews=await Review.deleteMany({_id:{$in:listing.reviews}});
        console.log(`deleted reviews ${deletedListingReviews} `)
    }
    
});

const Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing;