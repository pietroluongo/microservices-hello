import express from "express";
import connect from "./connections/mongoose";
import Order, { createOrder } from "./models/Order";
import type { Product } from "./models/Product";
import connectToRabbitMQ from "./connections/rabbitmq";

const PORT = process.env.PORT || 3002;

console.log("initializing...");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

(async () => {
  try {
    await connect();
    console.log("Connected to mongodb successfully");
  } catch (e) {
    console.error("Failed to connect to mongodb");
    return;
  }

  const { channel } = await connectToRabbitMQ();
  console.log("Awaiting consume...");
  channel.consume("order-service-queue", (data) => {
    if (!data) {
      console.warn("Consumed empty data from queue");
      return;
    }
    console.log("hit queue!");
    const jsonData: { products: Product[] } = JSON.parse(
      data.content.toString()
    );
    console.log("json data is", jsonData);
    const newOrder = createOrder(jsonData.products);
    channel.ack(data);
    channel.sendToQueue(
      "product-service-queue",
      Buffer.from(JSON.stringify(newOrder))
    );
  });
})();

// app.listen(PORT, () => {
//   console.log(`Order-Service listening on port ${PORT}`);
// });
