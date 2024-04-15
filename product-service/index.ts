import express from "express";
import mongoose from "mongoose";
import ProductRouter from "./router";
const PORT = process.env.PORT || 3001;

console.log("initializing...");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/products", ProductRouter);

(async () => {
  try {
    await mongoose.connect("mongodb://mongo:27017/scan-product-service");
    console.log("Connected to mongodb successfully");
  } catch (e) {
    console.error("Failed to connect to mongodb");
    return;
  }

  app.listen(PORT, () => {
    console.log(`Product-Service listening on port ${PORT}`);
  });
})();
