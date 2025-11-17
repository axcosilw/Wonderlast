const mongoose=require("mongoose");
const initData=require("./data.js");
const Listing=require("../models/listings.js");

const MONGO_URL="mongodb://127.0.0.1:27017/wonderlast";


main()
.then(()=>{
    console.log("CONNECTED WITH MONGODB")
}).catch((err)=>{
    console.log(err);
});

async function main(){
    await mongoose.connect(MONGO_URL);
};


const initDB=async()=>{
    await Listing.deleteMany({});
    //to add owner in all the listings of init same owner with below id
    const ownerId = new mongoose.Types.ObjectId('6919e3279dcb0becbf61bab4');
    initData.data = initData.data.map((obj) => ({ ...obj, owner: ownerId }));
   // console.log(initData.data);
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
};

initDB();