const express=require("express");
const app=express();
const mongoose=require("mongoose");
const Listing=require("./models/listings.js");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");



const MONGO_URL="mongodb://127.0.0.1:27017/wonderlast"
async function main(){
    await mongoose.connect(MONGO_URL);
};
main().then(()=>{
    console.log("CONNECTED WITH MONGODB")
}).catch((err)=>{
    console.log(err);
})


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"public")));

//1.root route
app.get("/",(req,res)=>{
    res.send("working");
});

//2.testting our model
// app.get("/testListing",async(req,res)=>{
//     let Listings= new Listing({
//         title:"my home",
//         description:"by the beach",
//         price:1200,
//         location:"goa",
//         country:"BHARAT"
//     });

//     await Listings.save();
//     console.log("sample was saved:",Listings);
//     res.send("succesful testing");

// });


//2.index route
app.get("/listings",async (req,res)=>{
    const allListings=await Listing.find({})
    res.render("listings/index.ejs",{allListings});
});


//4. new route
app.get("/listings/new",async(req,res)=>{
    res.render("listings/new.ejs");
});

//3.show route
app.get("/listings/:id" ,async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    res.render("listings/show.ejs",{listing})
})

// app.post('/chats',(req,res)=>{
//     let {from,to,msg}=req.body;//yha s urlencoded wali line likhi h parse krane k lie
//     let newChat=new Chat({
//         from:from,
//         to:to,
//         msg:msg,
//         created_at:new Date()
//     });
//     newChat.save().then((res)=>{"chat was saved"}).catch((err)=>{console.log(err)})
//     res.redirect("/chats");

//     }
// );

//4.(b)create route
app.post("/listings",async(req,res)=>{
    //another way
    //let listing =req.body.listing;
    const newListing=new Listing(req.body.listing);//instance
    await newListing.save();
    res.redirect("/listings");

    //console.log(listing);
});
    //olderway
    //let {title,description,image,price,location,country}=req.body;
    // let newListing=new Listing({
    //     title:title,
    //     description:description,
    //     price:price,
    //     location:location,
    //     country:country
    // });
    // newListing.save().then((res)=>{"listing was saved"}).catch((err=>{console.log(err);}))
    // res.redirect("/listings");


//5.edit route
app.get("/listings/:id/edit",async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
    //res.redirect("/listings/:id");
})


//5.(b)update route
app.put("/listings/:id",async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
})

//6.DELETE ROUTE
app.delete("/listings/:id",async(req,res)=>{
    let {id}=req.params;
    let deletedListing=await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
})

app.listen(8080,()=>{
    console.log("server is listening to port 8080");
});


