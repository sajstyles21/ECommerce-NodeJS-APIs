const router = require("express").Router();
const express = require("express");
const User = require("../models/User");
const path = require("path");
const Crypto = require("crypto-js");
var multer = require("multer");
const jwt = require("jsonwebtoken");

router.use(express.static(__dirname + "/public"));

//Load User Validations
const validateRegisterInput = require("../validations/register");
const validateLoginInput = require("../validations/login");

//Multer
/*var storage = multer.diskStorage({
  destination: function (req, image, cb) {
    cb(null, "../public/uploads");
  },
  filename: function (req, image, cb) {
    cb(
      null,
      image.fieldname + "_" + Date.now() + path.extname(image.originalname)
    );
  },
});
var upload = multer({ storage: storage }).single("image");*/

//Demo
router.get("/router", (req, res) => {
  res.send("hello world router");
});

//Register
router.post("/register", async (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);
  if (!isValid) {
    return res.status(400).json({ errors });
  }

  const newUser = new User({
    username: req.body.username,
    password: Crypto.AES.encrypt(
      req.body.password,
      process.env.PASS_SEC
    ).toString(),
    email: req.body.email,
  });
  try {
    const userAdded = await newUser.save();
    return res.status(200).json(userAdded);
  } catch (err) {
    if (err.code === 11000) {
      err.code === 11000 && err.keyPattern.email === 1
        ? (errors.user = "Email already exists")
        : "";
      err.code === 11000 && err.keyPattern.username === 1
        ? (errors.user = "Username already exists")
        : "";
      return res.status(400).json({ errors });
    }
    return res.status(500).json(err);
  }
});

//Login
router.post("/login", async (req, res) => {
  try {
    const { errors, isValid } = validateLoginInput(req.body);
    if (!isValid) {
      return res.status(400).json({ errors });
    }

    const user = await User.findOne({
      username: req.body.username,
    });

    if (!user) {
      errors.user = "User not found";
      return res.status(400).json({ errors });
    }

    const hashedPassword = Crypto.AES.decrypt(
      user.password,
      process.env.PASS_SEC
    );
    const originalPassword = hashedPassword.toString(Crypto.enc.Utf8);
    if (originalPassword !== req.body.password) {
      errors.user = "Wrong Password";
      return res.status(400).json({ errors });
    }

    const accessToken = jwt.sign(
      {
        id: user._id,
        isAdmin: user.isAdmin,
      },
      process.env.JWT_SEC,
      { expiresIn: "3d" }
    );

    const { password, ...others } = user._doc;

    return res.status(200).json({ ...others, accessToken });
  } catch (err) {
    return res.status(500).json(err);
  }
});
module.exports = router;
