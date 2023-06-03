import {
  APIError,
  STATUS_CODES,
  BadRequestError,
} from "../../utils/app-errors.js";
import { orderModel } from "../models/order.js";
import { productModel } from "../models/product.js";
import BusinessModel from "../models/business.js";

class OrderRepository {
  // create an order
  async CreateOrder({ customer, employee, products, totalBill, business,
    status, orderType }) {
    try {
      const order = new orderModel({
        customer,
        employee,
        products,
        totalBill,
        business,
        status,
        orderType
      });
      let saveOrder = await order.save();
      return saveOrder;
    } catch (err) {
      throw new APIError(
        "API ERROR",
        STATUS_CODES.INTERNAL_ERROR,
        `Unable to create order ${err.message}`
      );
    }
  }

  // get all orders
  async GetAllOrders() {
    try {
      const AllOrders = await orderModel.find();
      return AllOrders;
    } catch (err) {
      throw new APIError(
        "API ERROR",
        STATUS_CODES.INTERNAL_ERROR,
        `Unable to get orders ${err.message}`
      );
    }
  }

  // get all orders for a store
  async GetAllOrdersForAStore(id) {
    try {
      const AllOrders = await orderModel.find({ business: id });
      return AllOrders;
    } catch (err) {
      throw new APIError(
        "API ERROR",
        STATUS_CODES.INTERNAL_ERROR,
        `Unable to get orders ${err.message}`
      );
    }
  }

  // get all completed orders for a store
  async GetAllCompletedOrdersForAStore(id) {
    try {
      const AllOrders = await orderModel.find({
        business: id,
        status: "completed",
      })
        .populate("business", "businessName")
        // .populate("productId", "name")
        .populate({
          path: "products",
          populate: {
            path: "productId",
            select: "name description"
          }
        })
      return AllOrders;
    } catch (err) {
      throw new APIError(
        "API ERROR",
        STATUS_CODES.INTERNAL_ERROR,
        `Unable to get orders ${err.message}`
      );
    }
  }

  // get all completed orders for a customer
  async GetAllCompletedOrdersForACustomer(id) {
    try {
      const AllOrders = await orderModel.find({
        customer: id,
        status: "completed",
      });
      return AllOrders;
    } catch (err) {
      throw new APIError(
        "API ERROR",
        STATUS_CODES.INTERNAL_ERROR,
        `Unable to get orders ${err.message}`
      );
    }
  }

  // get all pending orders for a customer for cart
  async GetCustomerCart(id) {
    try {
      const AllOrders = await orderModel.find({
        customer: id,
        status: "pending",
      });
      return AllOrders;
    } catch (err) {
      throw new APIError(
        "API ERROR",
        STATUS_CODES.INTERNAL_ERROR,
        `Unable to get orders ${err.message}`
      );
    }
  }

  // update order by status
  async UpdateOrderByStatus({ orderId, status }) {
    try {
      const filterOrder = { _id: orderId };
      const updateStatus = { status: status };
      const updateOrder = orderModel.findByIdAndUpdate(
        filterOrder,
        updateStatus,
        { new: true }
      );
      return updateOrder;
    } catch (err) {
      throw new APIError(
        err.name ? err.name : "Order Not found",
        err.statusCode ? err.statusCode : STATUS_CODES.INTERNAL_ERROR,
        err.message
      );
    }
  }

  async DeleteOrder({ id }) {
    try {
      const order = await orderModel.findByIdAndRemove({ _id: id });
      return order;
    } catch (err) {
      throw new APIError(
        "API Error from Delete Order",
        STATUS_CODES.INTERNAL_ERROR,
        err.message
      );
    }
  }

  // update order by product items and quantity
  async UpdateOrderByProduct({ orderId, product }) {
    try {
      const filterOrder = { _id: orderId };
      const updateStatus = { product: product };
      const updateOrder = orderModel.findByIdAndUpdate(
        filterOrder,
        updateStatus,
        { new: true }
      );
      return updateOrder;
    } catch (err) {
      throw new APIError(
        err.name ? err.name : "Order Not found",
        err.statusCode ? err.statusCode : STATUS_CODES.INTERNAL_ERROR,
        err.message
      );
    }
  }
}

export default OrderRepository;
