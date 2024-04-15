import mongoose from "mongoose";

const connect = async () => {
  console.log("connecting to mongo...");
  await mongoose.connect("mongodb://mongo:27017/scan-order-service");
  console.log("Connected");
};

export default connect;
