const express = require("express");
const checkValidId = require("../middlewares/checkValidId.js");
const bcrypt = require("bcrypt");
const router = express.Router();
const UserModel = require("../models/user.model.js");
const { isValidObjectId } = require("mongoose");
router.post("/profile", async (req, res) => {
  try {
    const userId = req.body.id;
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
      return res.status(202).json({error:false,message:"Password was Changed successfull."});
    }
    else {
      return res.status(500).json({error:true,message:"Please enter valid password!."});
    }
  });
 
});
module.exports = router;
