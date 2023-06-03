import OrderService from "../service/order.js";
import { createMessage } from "../utils/messaging-que.js";

export const order = (app, channel) => {
  const orderService = new OrderService();

  // get orders
  app.get("/orders", async (req, res, next) => {
    try {
      const orders = await orderService.GetOrders();

      return res.status(200).json(orders);
    } catch (err) {
      next(err);
    }
  });

  // get all store orders
  app.get("/store/orders/:id", async (req, res, next) => {
    try {
      const id = req.params.id;
      const orders = await orderService.GetStoreOrders(id);
      return res.status(200).json(orders);
    } catch (err) {
      next(err);
    }
  });

  // get store completed orders
  app.get("/orders/:id", async (req, res, next) => {
    try {
      const id = req.params.id;
      const orders = await orderService.GetStoreOrdersHistory(id);
      return res.status(200).json(orders);
    } catch (err) {
      next(err);
    }
  });

  // get customer cart
  app.get("/cart/:id", async (req, res, next) => {
    try {
      const id = req.params.id;
      const orders = await orderService.GetCustomerCart(id);
      return res.status(200).json(orders);
    } catch (err) {
      next(err);
    }
  });

  // get customer orders history
  app.get("/customer/orders/:id", async (req, res, next) => {
    try {
      const id = req.params.id;
      const orders = await orderService.GetCustomerHistory(id);
      return res.status(200).json(orders);
    } catch (err) {
      next(err);
    }
  });

  // create order
  app.post("/order", async (req, res) => {
    try {
      const {
        customer,
        employee,
        products,
        totalBill,
        business,
        status,
        orderType,
      } = req.body;
      const newOrder = await orderService.CreateOrder({
        customer,
        employee,
        products,
        totalBill,
        business,
        status,
        orderType,
      });
      return res.status(200).json({ msg: "order created", order: newOrder });
    } catch (err) {
      console.log(err);
    }
  });

  // update order status
  app.patch("/order/status/:id", async (req, res) => {
    try {
      const orderId = req.params.id;
      const status = req.body.status;
      const updateOrder = await orderService.UpdateOrderStatus({
        orderId,
        status,
      });

      createMessage(channel, "order-updates", JSON.stringify(updateOrder));
      return res
        .status(200)
        .json({ msg: "order status updated", data: updateOrder });
    } catch (err) {
      res.status(400).json({ msg: err.msg });
    }
  });

  // update order
  app.put("/cart/:id", async (req, res) => {
    try {
      const orderId = req.params.id;
      const product = req.body.products;
      const updateOrder = await orderService.UpdateCart({
        orderId,
        product,
      });
      return res
        .status(200)
        .json({ msg: "order status updated", data: updateOrder });
    } catch (err) {
      res.status(400).json({ msg: err.msg });
    }
  });
};
