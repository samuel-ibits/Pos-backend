import { configs } from "../config/index.js";
import AuthController from "../service/index.js";
import { PublishMessage, SubscribeMessage } from "../utils/index.js";

const { NOTIFICATION_SERVICE, FAULT_SERVICE } = configs;
export const auth = (app, channel) => {
  const authService = new AuthController();

  app.get("/", async (req, res, next) => {
    res.send("This is index route for Akili-vendors");
  });

  // register new vendor
  app.post("/vendor", async (req, res, next) => {
    try {
      const {
        phone,
        name,
        address,
        businessId
      } = req.body;
      const { data } = await authService.SignUp({
        phone,
        name,
        address,
        businessId
      });

      // const payload = { event: "SIGNUP_EMPLOYEE", data: data };
      // PublishMessage(channel, EMPLOYEE_SERVICE, JSON.stringify(payload));
      res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  });

  // login EMPLOYEE
  app.post("/login", async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const { data } = await authService.Login({ email, password });
      const payload = { event: "LOGIN_EMPLOYEE", data: data };
      PublishMessage(channel, NOTIFICATION_SERVICE, JSON.stringify(payload));
      res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  });

  // get details of a EMPLOYEE
  app.get("/vendor/:id", async (req, res, next) => {
    try {
      const id = req.params.id;

      const { data } = await authService.GetProfile(id);

      return res.json(data);
    } catch (err) {
      next(err);
    }
  });

  // delete vendor
  app.delete("/vendor/:id", async (req, res, next) => {
    try {
      const id = req.params.id;

      const { data } = await authService.DeleteVendor(id);
      if (data.profile === null) {
        return res.json({ msg: 'User not found' });
      } else {
        return res.json({ msg: data.msg });
      }
    } catch (err) {
      next(err);
    }
  });

  // GetAllVendorsUsingAkili
  app.get("/vendors", async (req, res, next) => {
    try {
      const { data } = await authService.GetEveryVendors();
      return res.json(data);
    } catch (err) {
      next(err);
    }
  });

  // GetEveryVendorsofaStore
  app.get("/vendors/:id", async (req, res, next) => {
    try {
      const id = req.params.id;
      const { data } = await authService.GetEveryVendorsofaStore(id);
      return res.json(data);
    } catch (err) {
      next(err);
    }
  });

  app.put("/vendor/:id", async (req, res, next) => {
    let id = req.params;
    console.log(id)
    try {
      const {
        phone,
        name,
        address } =
        req.body;

      const { data } = await authService.UpdateVendorProfile(id, {
        phone,
        name,
        address
      });
      console.log(data)
      return res.json(data);
    } catch (err) {
      next(err);
    }
  });

};
