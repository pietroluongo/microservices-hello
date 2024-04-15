import amqp from "amqplib";
let channel: amqp.Channel, connection;

// Connect to RabbitMQ
export async function connectToRabbitMQ() {
  console.log("Connecting to rabbitmq...");
  const amqpServer = "amqp://user:password@rabbitmq:5672";
  connection = await amqp.connect(amqpServer);
  channel = await connection.createChannel();
  await channel.assertQueue("product-service-queue");
  console.log("Connected to rabbitmq server");
  return { channel, connection };
}
