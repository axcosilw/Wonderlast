const mongoose=require("mongoose");
const Schema= mongoose.Schema;
const Review=require("./review.js");

const listingSchema= new Schema({
    title:{
        type:String,
        required:true},

    description:String,

    image:{
            type:String,
            default:"https://plus.unsplash.com/premium_photo-1760733763029-2a8eb5d344eb?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwyfHx8ZW58MHx8fHx8&auto=format&fit=crop&q=60&w=1600",
        set: (v)=>v === ""
        ? "https://plus.unsplash.com/premium_photo-1760733763029-2a8eb5d344eb?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwyfHx8ZW58MHx8fHx8&auto=format&fit=crop&q=60&w=1600"
        :v,
 
        },

    

    price:Number,
    location:String,
    country:String,
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