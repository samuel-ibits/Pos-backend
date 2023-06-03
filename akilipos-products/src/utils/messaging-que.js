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

export const createMessage = async (channel, queue, message) => {
  try {
    // const channel = await connect();
    await channel.assertQueue(queue);
    await channel.sendToQueue(queue, Buffer.from(message));
    console.log(`Message sent to '${queue}': ${message}`);
  } catch (error) {
    console.error(`Error publishing message to '${queue}':`, error);
  }
};

export const consumeMessage = async (channel, routingKey, queue, callback) => {
  try {
    // const channel = await connect();
    await channel.assertExchange(EXCHANGE_NAME, "direct", { durable: true });
    const { queue: queueName } = await channel.assertQueue(queue);
    await channel.bindQueue(queueName, EXCHANGE_NAME, routingKey);
    await channel.consume(queueName, (message) => {
      if (message !== null) {
        const content = message.content.toString();
        callback(content); // Process the message

        channel.ack(message); // Acknowledge message processing completion
      }
    });
    console.log(
      `Consuming messages from exchange '${EXCHANGE_NAME}' with routing key '${routingKey}'...`
    );
  } catch (error) {
    console.error(
      `Error consuming messages from exchange '${exchange}' with routing key '${routingKey}':`,
      error
    );
  }
};
