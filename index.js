const express = require("express");
const mongoose = require("mongoose");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const authRoute = require("./routes/auth");
const userRoute = require("./routes/user");
const productRoute = require("./routes/product");
const cartRoute = require("./routes/cart");
const orderRoute = require("./routes/order");

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

app.use(express.json());
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/products", productRoute);
app.use("/api/carts", cartRoute);
app.use("/api/orders", orderRoute);

app.listen(process.env.PORT || 5001, () => {
  c("listening to " + process.env.PORT);
  c("E-Commerce NodeJS APIs");
});
