const router = require("express").Router();
const Product = require("../models/Product");
const {
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");

//Create product
router.post("/", verifyTokenAndAdmin, async (req, res) => {
  const payload = req.body;
  const newProduct = new Product(payload);

  try {
    const product = await newProduct.save();
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json(err);
  }
});

//Update product
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const updateProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updateProduct);
  } catch (err) {
    res.status(500).json(err);
  }
});

//Delete product
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json("Product has been deleted");
  } catch (err) {
    res.status(500).json(err);
  }
});

//Get product
router.get("/find/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.status(200).json(product);
    }
    res.status(400).json("Product Not Found");
  } catch (err) {
    res.status(500).json(err);
  }
});

//Get all products
router.get("/all", verifyTokenAndAdmin, async (req, res) => {
  const qNew = req.query.new;
  const qCategory = req.query.category;
  try {
    let products;
    if (qNew) {
      products = await Product.find().sort({ createdAt: -1 }).limit(5);
    } else if (qCategory) {
      products = await Product.find({
        categories: {
          $in: [qCategory],
        },
      }).limit(5);
    } else {
      products = await Product.find();
    }
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
