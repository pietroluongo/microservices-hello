import amqp from "amqplib";

async function connectToRabbitMQ() {
  console.log("Connecting to rabbitmq...");
  const amqpServer = "amqp://user:password@rabbitmq:5672";
  const connection = await amqp.connect(amqpServer);
  const channel = await connection.createChannel();
  await channel.assertQueue("order-service-queue");
  console.log("Connected successfully!");
  return { connection, channel };
}

export default connectToRabbitMQ;
