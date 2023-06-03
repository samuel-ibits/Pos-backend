import { IsAuthenticated } from "../../isAuthenticated.js";
import MessageService from "../service/message.js";
// import ProductService from "../service/product.js";

import { SendTextMessage, ValidateSignature } from "../utils/index.js";
import { PublishProductService } from "../utils/rabbitMqConnection.js";

export const product = (app, channel) => {
  const messageService = new MessageService();

  // get messages
  app.get("/messages", async (req, res) => {
    try {
      const messages = await messageService.GetMessages();
      console.log(messages);
      return res.status(200).json(messages);
    } catch (err) {
      console.log(err.msg);
    }
  });
  // create a message
  app.post("/message", async (req, res) => {
    try {
      console.log("jkjdkjskjdkj from message post");
      const { business, sender, subject, body, mobileNumbers } = req.body;
      let destructuredNumbers = mobileNumbers.split(",");
      const mobiles = destructuredNumbers.join(",");
      const textMessage = `${subject} \n ${body} `;
      const businessName = sender;
      console.log(mobiles, "numbers");
      const messageParameters = {
        business,
        sender,
        subject,
        body,
        mobileNumbers: destructuredNumbers,
      };

      const sendMessage = await SendTextMessage({
        mobiles,
        textMessage,
        businessName,
      });
      console.log(sendMessage, "from send message");
      if (sendMessage.status === "OK") {
        const message = await messageService.CreateMessage({
          ...messageParameters,
        });
        console.log(message, "from message");
        return res
          .status(200)
          .json({ msg: "message sent successfully", sentMessage: message });
      } else {
        return res.status(500).json({ msg: "something wrong happened" });
      }
    } catch (err) {
      console.log(err.msg);
    }
  });

  // get product
  app.get("/product/:productId", async (req, res) => {
    try {
      const productId = req.params.productId;
      const product = await productService.GetAProduct({ productId });
      console.log("Product, api product service");
      res.status(200).send(product);
    } catch (err) {
      res.status(404).send(err.message);
    }
  });
  // edit product
  app.patch("/product/:id", IsAuthenticated, async (req, res) => {
    try {
      const { product } = req.body;
      const { productId } = req.params.id;
      // the editProduct requires two arguements: productId and product
      const requiredEditParameters = { product, productId };
      const { editedProduct } = await productService.EditProduct(
        requiredEditParameters
      );
      console.log(editedProduct);
    } catch (err) {
      res.status(400).send(err.message);
    }
  });

  // get cart
  app.get("/cart", IsAuthenticated, async (req, res) => {
    const cartowner = req.user._id;
    // const cartowner = req.params.cartowner;
    console.log(cartowner, "the ownner");
    try {
      const cart = await productService.GetCart(cartowner);
      res.status(200).send(cart);
    } catch (err) {
      console.log(err);
    }
  });

  // create cart
  app.post("/cart", IsAuthenticated, async (req, res) => {
    const owner = req.user._id;
    const { quantity, productId } = req.body;
    // const requiredCartParameters = { owner, productId, quantity };
    try {
      const cart = await productService.CreateCart({
        owner,
        productId,
        quantity,
      });
      console.log(cart, "cart created successfully");
      return res.status(200).send(cart);
    } catch (err) {
      console.log(err);
    }
  });
};
