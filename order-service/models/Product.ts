import mongoose from "mongoose";
const Schema = mongoose.Schema;

export interface Product {
  name: string;
  price: number;
  description: string;
}

const ProductSchema = new Schema<Product>(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Product", ProductSchema);
