const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
const authRoute = require("./routes/auth");
const userRoute = require("./routes/user");
const productRoute = require("./routes/product");
const cartRoute = require("./routes/cart");
const orderRoute = require("./routes/order");
const stripeRoute = require("./routes/stripe");
const router = require("./routes/auth");

//Console bind
const c = console.log.bind(console);

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    c("DB Connected");
  })
  .catch((err) => {
    c(err);
  });

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/products", productRoute);
app.use("/api/carts", cartRoute);
app.use("/api/orders", orderRoute);
app.use("/api", stripeRoute);

app.use(express.static(path.join(__dirname, "public")));

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "pulic", "index.html"));
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  c("listening to " + PORT);
  c("E-Commerce NodeJS APIs");
});
