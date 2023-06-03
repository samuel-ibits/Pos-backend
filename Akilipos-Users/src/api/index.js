import { configs } from "../config/index.js";
import AuthController from "../service/index.js";
import { PublishMessage, SubscribeMessage } from "../utils/index.js";

const { NOTIFICATION_SERVICE, FAULT_SERVICE } = configs;
export const auth = (app, channel) => {
  const authService = new AuthController();

  app.get("/", async (req, res, next) => {
    res.send("This is index route for Akili-Customers");
  });

  // register new customer
  app.post("/customer", async (req, res, next) => {
    try {
      const {
        email,
        phone,
        name,
        username,
        address,
        password,
        confirmPassword,
        storeId
      } = req.body;
      const { data } = await authService.SignUp({
        email,
        phone,
        name,
        username,
        address,
        password,
        confirmPassword,
        storeId
      });

      // const payload = { event: "SIGNUP_CUSTOMER", data: data };
      // PublishMessage(channel, CUSTOMER_SERVICE, JSON.stringify(payload));
      res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  });

  // login customer
  app.post("/login", async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const { data } = await authService.Login({ email, password });
      const payload = { event: "LOGIN_CUSTOMER", data: data };
      PublishMessage(channel, NOTIFICATION_SERVICE, JSON.stringify(payload));
      res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  });

  // get details of a customer
  app.get("/customer/:id", async (req, res, next) => {
    try {
      const id = req.params.id;

      const { data } = await authService.GetProfile({ id });

      return res.json(data);
    } catch (err) {
      next(err);
    }
  });

  // delete customer
  app.delete("/customer/:id", async (req, res, next) => {
    try {
      const id = req.params.id;

      const { data } = await authService.DeleteCustomer({ id });
      if (data.profile === null) {
        return res.json({ msg: 'User not found' });
      } else {
        return res.json({ msg: data.msg });
      }
    } catch (err) {
      next(err);
    }
  });

  // GetAllCustomersUsingAkili
  app.get("/customers", async (req, res, next) => {
    try {
      const { data } = await authService.GetEveryCustomers();
      return res.json(data);
    } catch (err) {
      next(err);
    }
  });

  // GetEveryCustomersofaStore
  app.get("/customers/:id", async (req, res, next) => {
    try {
      const id = req.params.id;
      const { data } = await authService.GetEveryCustomersofaStore({ id });
      return res.json(data);
    } catch (err) {
      next(err);
    }
  });

  app.put("/editprofile", async (req, res, next) => {
    try {
      const { userId, name, phone, address, gender, birthday, state } =
        req.body;

      const { data } = await authService.UpdateUserProfile({
        name,
        email,
        phone,
        address,
        gender,
        birthday,
        state,
        userId,
      });
      return res.json(data);
    } catch (err) {
      next(err);
    }
  });

};
