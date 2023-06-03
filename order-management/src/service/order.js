import OrderRepository from "../dba/repository/orderRepository.js";
import {
  APIError,
  // BadRequestError,
  STATUS_CODES,
  // ValidationError,
} from "../utils/app-errors.js";

export default class OrderService {
  constructor() {
    this.orderRepository = new OrderRepository();
  }

  // get all orders
  async GetOrders() {
    try {
      const orders = await this.orderRepository.GetAllOrders();
      return orders;
    } catch (err) {
      throw new APIError(
        err.name ? err.name : "Order not found",
        err.statusCode ? err.statusCode : STATUS_CODES.INTERNAL_ERROR,
        err.message
      );
    }
  }

  // get all orders of a store
  async GetStoreOrders(id) {
    try {
      const orders = await this.orderRepository.GetAllOrdersForAStore(id);
      return orders;
    } catch (err) {
      throw new APIError(
        err.name ? err.name : "Order not found",
        err.statusCode ? err.statusCode : STATUS_CODES.INTERNAL_ERROR,
        err.message
      );
    }
  }

  // get all completed orders of a store
  async GetStoreOrdersHistory(id) {
    try {
      const orders = await this.orderRepository.GetAllCompletedOrdersForAStore(
        id
      );
      return orders;
    } catch (err) {
      throw new APIError(
        err.name ? err.name : "Order not found",
        err.statusCode ? err.statusCode : STATUS_CODES.INTERNAL_ERROR,
        err.message
      );
    }
  }

  // get cart orders of a customer
  async GetCustomerCart(id) {
    try {
      const orders = await this.orderRepository.GetCustomerCart(id);
      return orders;
    } catch (err) {
      throw new APIError(
        err.name ? err.name : "Order not found",
        err.statusCode ? err.statusCode : STATUS_CODES.INTERNAL_ERROR,
        err.message
      );
    }
  }

  // get customer order history
  async GetCustomerHistory(id) {
    try {
      const orders =
        await this.orderRepository.GetAllCompletedOrdersForACustomer(id);
      return orders;
    } catch (err) {
      throw new APIError(
        err.name ? err.name : "Order not found",
        err.statusCode ? err.statusCode : STATUS_CODES.INTERNAL_ERROR,
        err.message
      );
    }
  }

  // create a new order
  async CreateOrder({ customer, employee, products, totalBill, business,
    status, orderType }) {
    try {
      const createOrder = await this.orderRepository.CreateOrder({
        customer,
        employee,
        products,
        totalBill,
        business,
        status,
        orderType
      });
      return createOrder;
    } catch (err) {
      throw new APIError(
        err.name ? err.name : "Order Not Created",
        err.statusCode ? err.statusCode : STATUS_CODES.INTERNAL_ERROR,
        err.message
      );
    }
  }

  // update order status
  async UpdateOrderStatus({ orderId, status }) {
    try {
      const newOrderStatus = await this.orderRepository.UpdateOrderByStatus({
        orderId,
        status,
      });
      return newOrderStatus;
    } catch (err) {
      throw new APIError(
        err.message ? err.message : "order not updated",
        err.statusCode ? err.statusCode : STATUS_CODES.INTERNAL_ERROR,
        err.message
      );
    }
  }

  // update cart product
  async UpdateCart({ orderId, products }) {
    try {
      const newOrderStatus = await this.orderRepository.UpdateOrderByProduct({
        orderId,
        products,
      });
      return newOrderStatus;
    } catch (err) {
      throw new APIError(
        err.message ? err.message : "order not updated",
        err.statusCode ? err.statusCode : STATUS_CODES.INTERNAL_ERROR,
        err.message
      );
    }
  }
}
