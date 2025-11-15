const express=require("express");
const router=express.Router();

//users
//index route
router.get("/",(req,res)=>{
    res.send("GET for users")
})

//post route
router.post("/",(req,res)=>{
    res.send("POST for users")
}) 

//SHOW route
router.get("/:id",(req,res)=>{
    res.send("GET for SHOW users")
})

//delete route
router.delete("/:id",(req,res)=>{
    res.send("GET for delete users")
});

module.exports=router;