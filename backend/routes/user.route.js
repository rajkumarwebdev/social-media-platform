const express = require("express");
const checkValidId = require("../middlewares/checkValidId.js");
const bcrypt = require("bcrypt");
const router = express.Router();
const UserModel = require("../models/user.model.js");
const { isValidObjectId } = require("mongoose");
const multer = require("multer");
const path = require("path");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images"); // Set the destination folder
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
router.post("/profile", async (req, res) => {
  try {
    const userId = req.body.id;
    console.log(userId);
    console.log("hii");
    if (!isValidObjectId(userId)) {
      return res.status(400).json({ error: "Oops!User Not Found" });
    }
    if (userId) {
      const response = await UserModel.findById({ _id: userId });
      if (!response)
        return res.status(400).json({ error: "Oops!User Not Found" });
      return res.json({ response });
    }
    return res.status(400).json({ error: "Oops!User Not Found" });
  } catch (error) {
    console.log(error.message);
  }
});
router.post("/update/profiles", async (req, res) => {
  try {
    console.log(req.body.id);
    const response =await UserModel.findByIdAndUpdate(req.body.id, {
      name: req.body.name,
      username: req.body.username,
      gender: req.body.gender,
    });
    console.log(response);
    if (response) return res.json({ status: true });
  } catch (err) {
    return res.json({ error: err.message });
  }
});

router.post("/update/profile", upload.single("file"), async (req, res) => {
  let image = "/images/userprofile.png";

  if (req.file && req.body.ids) {
    const response = await UserModel.findByIdAndUpdate(req.body.ids, {
      userProfile: req.file.filename ? req.file.filename : image,
    });
    return res.json({ picture: response.userProfile });
  }

  return res.json({ upload: true });
});

router.get("/allusers", async (req, res) => {
  try {
    const response = await UserModel.find({});
    if (!response) {
      return res.status(500).json({ error: "No users Found" });
    } else {
      return res.status(200).json(response);
    }
  } catch (error) {
    return res
      .status(500)
      .json({ error: `Internal server error!.${error.message}` });
  }
});
//Change user's old password
router.put("/changepassword", async (req, res) => {
  const userid = req.body.userId;
  const newPassword = req.body.newpassword;
  const currentPass = req.body.currentPass;
  const response = await UserModel.findById(userid);
  const oldPassword = response.password;
  bcrypt.compare(currentPass, oldPassword).then(async (result) => {
    if (result) {
      const encrytedPass = await bcrypt.hash(newPassword, 10);
      const ress = await UserModel.findByIdAndUpdate(userid, {
        password: encrytedPass,
      });
      return res
        .status(202)
        .json({ error: false, message: "Password was Changed successfull." });
    } else {
      return res
        .status(500)
        .json({ error: true, message: "Please enter valid password!." });
    }
  });
});

module.exports = router;
