const router = require("express").Router();
const Cart = require("../models/Cart");
const {
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
  verifyToken,
} = require("./verifyToken");

//Create cart
router.post("/", verifyToken, async (req, res) => {
  const newCart = new Cart(req.body);

  try {
    const cart = await newCart.save();
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json(err);
  }
});

//Update cart
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const updateCart = await Cart.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updateCart);
  } catch (err) {
    res.status(500).json(err);
  }
});

//Delete cart
router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    await Cart.findByIdAndDelete(req.params.id);
    res.status(200).json("Cart has been deleted");
  } catch (err) {
    res.status(500).json(err);
  }
});

//Get user cart
router.get("/find/:userId", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const cart = await Cart.findOne({
      userId: req.params.userId,
    });
    if (cart) {
      res.status(200).json(cart);
    }
    res.status(400).json("Cart Not Found");
  } catch (err) {
    res.status(500).json(err);
  }
});

//Get all
router.get("/", verifyTokenAndAdmin, async (req, res) => {
  try {
    const allCarts = await Cart.find();
    res.status(200).json(allCarts);
  } catch (err) {
    res.status(500).json(err);
  }
});
module.exports = router;
