const mongoose =require("mongoose");
const postSchema = new mongoose.Schema({
    content:{type:String,trim:true},
    postedBy:{type:mongoose.Schema.Types.ObjectId,ref:"Users"},
    pinned:Boolean,
    likes:[{type:mongoose.Schema.Types.ObjectId,ref:"Users"}],
    comments:[{type:mongoose.Schema.Types.ObjectId,ref:"Comments"}],
},{
    timestamps:true,versionKey:false
})

module.exports=mongoose.model("Posts",postSchema);