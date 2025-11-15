const express=require("express");
const router=express.Router();


//posts
//index route
router.get("/",(req,res)=>{
    res.send("GET for posts")
})

//post route
router.post("/",(req,res)=>{
    res.send("POST for posts")
}) 

//SHOW route
router.get("/:id",(req,res)=>{
    res.send("GET for SHOW posts")
})

//delete route
router.delete("/:id",(req,res)=>{
    res.send("GET for delete posts")
})

module.exports=router;