import amqplib from "amqplib";
import { configs } from "../config/index.js";
const { EXCHANGE_NAME, MSG_QUEUE_URL, PRODUCT_SERVICE, ORDER_SERVICE } =
  configs;
let channel;

async function connect() {
  const amqpServer = MSG_QUEUE_URL;
  const connection = await amqplib.connect(amqpServer);
  channel = await connection.createChannel();
  await channel.assertQueue(PRODUCT_SERVICE);
}
connect();
let order;
export const PublishProductService = async ({ products, userEmail }) => {
  channel.sendToQueue(
    ORDER_SERVICE,
    Buffer.from(JSON.stringify({ products, userEmail }))
  );
  await channel.consume(PRODUCT_SERVICE, (data) => {
    order = JSON.parse(data.content);
    res.json(order);
  });
};
