const express = require("express");
const router=express.Router();

const UserModel = require("../models/user.model.js")
const PostModel = require("../models/post.model.js");


//Create single post
router.post("/new",async(req,res)=>{
    const content=req.body.content;
    const postedUserId=req.body.postedBy;
    try {
       const response=await  PostModel.create({content:content,postedBy:postedUserId});
       return res.status(201).json(response);
    } catch (error) {
        return res.json({error:error.message});
    }
});

router.get("/",async(req,res)=>{
    try {
        const response=await PostModel.find({},{likeCount:{$size:"$likes"},content:1,createdAt:1,updatedAt:1,likes:1}).populate("postedBy");
        return res.json({response,len:response.length});
    } catch (error) {
        res.sendStatus(500);
    }
});

router.put("/like",async(req,res)=>{
    try {
        const postId=req.body.postId;
        const currentUserId=req.body.currentUserId;
       const response= (await PostModel.find({$and:[{_id:postId},{likes:currentUserId}]})).length;
        if(response!=1){
            await PostModel.updateOne({_id:postId},{$push:{likes:currentUserId}});
            await UserModel.updateOne({_id:currentUserId},{$push:{likes:postId}});
        }
        else{
           const res= await PostModel.updateOne({_id:postId},{$pull:{likes:currentUserId}});
            await UserModel.updateOne({_id:currentUserId},{$pull:{likes:postId}});
        }
        const post=await PostModel.findOne({_id:postId});
        const likeCount=post?.likes?post.likes.length:"0";
        res.json({likeCount:likeCount});
    } catch (error) {
        console.log(error.message);
        res.sendStatus(500);
        
    }
})
module.exports=router;
