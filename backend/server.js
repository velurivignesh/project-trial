// ================= IMPORTS =================
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

// ================= APP SETUP =================
const app = express();
const PORT = 5000;

// ================= MIDDLEWARE =================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ================= MONGODB CONNECTION =================
mongoose.connect("mongodb://127.0.0.1:27017/farm2customer")
.then(() => {
  console.log("=================================");
  console.log("MongoDB connected ✅");
  console.log("=================================");
})
.catch((err) => {
  console.log("MongoDB connection error ❌", err);
});

// ================= USER SCHEMA =================
const userSchema = new mongoose.Schema({

  fullname: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true
  }

});

const User = mongoose.model("User", userSchema);

// ================= PRODUCT SCHEMA =================
const productSchema = new mongoose.Schema({

  name: String,
  price: Number,
  quantity: String,
  freshness: String

});

const Product = mongoose.model("Product", productSchema);

// ================= ORDER SCHEMA =================
const orderSchema = new mongoose.Schema({

  customerName: String,
  productName: String,
  quantity: String,
  address: String,
  phone: String,

  status: {
    type: String,
    default: "Pending"
  },

  orderDate: {
    type: Date,
    default: Date.now
  }

});

const Order = mongoose.model("Order", orderSchema);

// ================= HOME ROUTE =================
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// ================= TEST ROUTE =================
app.get("/hello", (req, res) => {
  res.send("Hello working ✅");
});

// ================= REGISTER ROUTE =================
app.post("/register", async (req, res) => {

  try {

    const { fullname, email, password } = req.body;

    // check existing user
    const existingUser = await User.findOne({ email });

    if (existingUser) {

      return res.json({
        message: "User already exists ❌"
      });

    }

    // create new user
    const newUser = new User({
      fullname,
      email,
      password
    });

    await newUser.save();

    res.json({
      message: "Registration successful ✅"
    });

  }
  catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Registration failed ❌"
    });

  }

});

// ================= LOGIN ROUTE =================
app.post("/login", async (req, res) => {

  try {

    const { email, password } = req.body;

    const user = await User.findOne({ email, password });

    if (user) {

      res.json({
        message: "Login successful ✅",
        user: user
      });

    }
    else {

      res.json({
        message: "Invalid email or password ❌"
      });

    }

  }
  catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Login failed ❌"
    });

  }

});

// ================= PRODUCT ROUTES =================

// Add product
app.post("/add-product", async (req, res) => {

  try {

    const product = new Product(req.body);

    const savedProduct = await product.save();

    res.status(201).json(savedProduct);

  }
  catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Error saving product ❌"
    });

  }

});

// Get products
app.get("/products", async (req, res) => {

  try {

    const products = await Product.find();

    res.json(products);

  }
  catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Error fetching products ❌"
    });

  }

});

// ================= ORDER ROUTES =================

// Place order
app.post("/place-order", async (req, res) => {

  try {

    const order = new Order(req.body);

    const savedOrder = await order.save();

    res.json({
      message: "Order placed successfully ✅",
      order: savedOrder
    });

  }
  catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Error placing order ❌"
    });

  }

});

// Get orders
app.get("/orders", async (req, res) => {

  try {

    const orders = await Order.find();

    res.json(orders);

  }
  catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Error fetching orders ❌"
    });

  }

});

// ================= START SERVER =================
app.listen(PORT, () => {

  console.log("=================================");
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log("=================================");

});
