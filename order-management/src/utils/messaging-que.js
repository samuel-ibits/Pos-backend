import amqplib from "amqplib";
import { configs } from "../config/index.js";
const { EXCHANGE_NAME, MSG_QUEUE_URL, PRODUCT_SERVICE, ORDER_SERVICE } =
  configs;

export const AkiliChannelQue = async () => {
  try {
    const connection = await amqplib.connect(MSG_QUEUE_URL);
    const channel = await connection.createChannel();
    return channel;
  } catch (error) {
    console.error("Error connecting to RabbitMQ:", error);
    process.exit(1);
  }
};

export const createMessage = async (channel, routingKey, message) => {
  try {
    // const channel = await connect();
    await channel.assertExchange(EXCHANGE_NAME, "direct", { durable: true });
    await channel.publish(EXCHANGE_NAME, routingKey, Buffer.from(message));
    console.log(
      `Message sent to exchange '${EXCHANGE_NAME}' with routing key '${routingKey}': ${message}`
    );
  } catch (error) {
    console.error(
      `Error publishing message to exchange '${exchange}' with routing key '${routingKey}':`,
      error
    );
  }
};

export const consumeMessage = async (channel, queue, callback) => {
  try {
    // const channel = await connect();
    await channel.assertQueue(queue);
    await channel.consume(queue, (message) => {
      if (message !== null) {
        const content = message.content.toString();
        callback(content); // Process the message

        console.log(content, "from message queue content");
        channel.ack(message); // Acknowledge message processing completion
      }
    });
    console.log(`Consuming messages from '${queue}'...`);
  } catch (error) {
    console.error(`Error consuming messages from '${queue}':`, error);
  }
};
