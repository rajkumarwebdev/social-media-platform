const express = require("express");
const router = express.Router();
const checkValidId = require("../middlewares/checkValidId.js");
const UserModel = require("../models/user.model.js");
const PostModel = require("../models/post.model.js");
const CommentModel = require("../models/comment.model.js");
const multer = require("multer");
const postModel = require("../models/post.model.js");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/posts"); // Set the destination folder
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now() + "-" + file.originalname); // Set the file name
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5, // 5 MB limit (adjust as needed)
  },
});
router.post("/image/new", upload.single("file"), async (req, res) => {
 
  if (req.file && req.body.id) {
    //pending work //create new model for this type of posts
    const filename = req.file.filename;
    const postid = req.body.id;
    const response = await PostModel.findByIdAndUpdate(postid, { image: filename, isImage: true })
   console.log(response);
    return res.json({"status":true})
  }
});

//Create single post
router.post("/new", async (req, res) => {
  const content = req.body.content;
  const postedUserId = req.body.postedBy;
  try {
    const response = await PostModel.create({
      content: content,
      postedBy: postedUserId,
    });
   
    await UserModel.findByIdAndUpdate(
      { _id: postedUserId },
      { $push: { posts: response._id } }
    );
    return res.status(201).json(response);
  } catch (error) {
    return res.json({ error: error.message });
  }
});

router.put("/delete", async (req, res) => {
  try {
    const postId = req.body.postId;
    const currentUserId = req.body.currentUserId;
    await UserModel.updateOne(
      { _id: currentUserId },
      { $pull: { likes: postId } }
    );
    await UserModel.findByIdAndUpdate(
      { _id: currentUserId },
      { $pull: { posts: postId } }
    );
    await PostModel.findByIdAndDelete({ _id: postId });
    res.json({ status: true });
  } catch (error) {
    console.log(error.message);
    res.sendStatus(500);
  }
});

router.get("/", async (req, res) => {
  try {
    const response = await PostModel.find(
      {},
      {
        likeCount: { $size: "$likes" },
        commentCount: { $size: "$comments" },
        content: 1,
        createdAt: 1,
        updatedAt: 1,
        likes: 1,
        image: 1,
        isImage:1
      }
    ).populate("postedBy");
    return res.json({ response, len: response.length });
  } catch (error) {
    res.sendStatus(500);
  }
});

//get single post
router.get("/:id", async (req, res) => {
  try {
    const postId = req.body.postid;

    console.log("Received", postId);
    res.send("Good");
    // return res.json(response);
  } catch (error) {
    res.sendStatus(500);
  }
});

//Get comment count for single post
router.post("/ccount", async (req, res) => {
  try {
    // const postId=req.body.postid;
    const response = await PostModel.find(
      {},
      { commentCount: { $size: "$comments" } }
    );

    return res.json(response);
  } catch (error) {
    res.sendStatus(500);
  }
});

router.put("/like", async (req, res) => {
  try {
    const postId = req.body.postId;
    const currentUserId = req.body.currentUserId;
    const response = (
      await PostModel.find({
        $and: [{ _id: postId }, { likes: currentUserId }],
      })
    ).length;
    if (response != 1) {
      await PostModel.updateOne(
        { _id: postId },
        { $push: { likes: currentUserId } }
      );
      await UserModel.updateOne(
        { _id: currentUserId },
        { $push: { likes: postId } }
      );
    } else {
      const res = await PostModel.updateOne(
        { _id: postId },
        { $pull: { likes: currentUserId } }
      );
      await UserModel.updateOne(
        { _id: currentUserId },
        { $pull: { likes: postId } }
      );
    }
    const post = await PostModel.findOne({ _id: postId });
    const likeCount = post?.likes ? post.likes.length : "0";
    res.json({ likeCount: likeCount });
  } catch (error) {
    console.log(error.message);
    res.sendStatus(500);
  }
});
//Store post comment
router.post("/comment", async (req, res) => {
  try {
    const postId = req.body.postId;
    const comment = req.body.comment;
    const userId = req.body.userId;
    // console.log(postId,comment,userId)
    const response = await CommentModel.create({
      commentContent: comment,
      commentedBy: userId,
      postId: postId,
    });
    await PostModel.findByIdAndUpdate(postId, {
      $push: { comments: response._id },
    });
  } catch (error) {
    console.log(error.message);
  }
});

//Get all comments for a single post
router.post("/comments", async (req, res) => {
  try {
    const postId = req.body.postId;
    // console.log(postId)
    const response = await CommentModel.find({ postId: postId }).populate(
      "commentedBy"
    );
    res.json(response);
  } catch (error) {}
});

module.exports = router;
