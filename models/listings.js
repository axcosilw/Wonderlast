const mongoose=require("mongoose");
const Schema= mongoose.Schema;

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

//         image: {
//     type: String,
//     default: "https://plus.unsplash.com/premium_photo-1760733763029-2a8eb5d344eb?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwyfHx8ZW58MHx8fHx8&auto=format&fit=crop&q=60&w=1600",
//     set: function (v) {
//       // If someone passes an object with `url`, return that
//       if (v && typeof v === "object" && v.url) {
//         return v.url;
//       }

//       // If they pass an empty string, use default
//       if (v === "") {
//         return "https://plus.unsplash.com/premium_photo-1760733763029-2a8eb5d344eb?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwyfHx8ZW58MHx8fHx8&auto=format&fit=crop&q=60&w=1600";
//       }

//       // Otherwise, assume it's already a string
//       return v;
//     }
//   },

    price:Number,
    location:String,
    country:String
});

const Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing;