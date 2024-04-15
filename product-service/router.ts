import { Router } from "express";
import Product from "./models/Product";
import { connectToRabbitMQ } from "./rabbitmq";

const router = Router();
const { channel, connection } = await connectToRabbitMQ();

// Create a new product
router.post("/", async (req, res) => {
  const { name, price, description } = req.body;
  console.log(req.body);
  if (!name || !price || !description) {
    return res.status(400).json({
      message: "Please provide name, price and description",
    });
  }
  const product = await new Product({ ...req.body });
  await product.save();
  return res.status(201).json({
    message: "Product created successfully",
    product,
  });
});

router.get("/", async (req, res) => {
  const products = await Product.find({});
  console.log(products);
  return res.status(200).json({
    products,
  });
});

// Buy a product
router.post("/buy", async (req, res) => {
  const { productIds } = req.body;
  const products = await Product.find({ _id: { $in: productIds } });

  if (products.length === 0) {
    return res.status(400).send({ message: "invalid product id" });
  }

  console.log("Sending to queue...", products);

  // Send order to RabbitMQ order queue
  channel.sendToQueue(
    "order-service-queue",
    Buffer.from(
      JSON.stringify({
        products,
      })
    )
  );

  console.log("sent!");
  console.log("Awaiting consume...");
  // Consume previously placed order from RabbitMQ & acknowledge the transaction
  await channel.consume("product-service-queue", (data) => {
    if (!data) {
      console.warn("Empty message consumed");
      return;
    }
    const order = data.content.toJSON();
    console.log("Consumed from product-service-queue", order);
    channel.ack(data);

    // Return a success message
    return res.status(201).json({
      message: "Order placed successfully",
      order: String.fromCharCode(...order.data),
    });
  });
});

export default router;
