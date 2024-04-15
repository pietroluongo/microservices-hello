import mongoose from "mongoose";
import type { Product } from "./Product";
const Schema = mongoose.Schema;

const OrderSchema = new Schema(
  {
    products: [{ product_id: String }],
    total: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", OrderSchema);

// Create an order
export const createOrder = (products: Product[]) => {
  const total = products.reduce((old, v) => old + v.price, 0);

  const order = new Order({
    products,
    total,
  });
  order.save();
  return order;
};

export default Order;
