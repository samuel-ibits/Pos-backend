import { configs } from "../config/index.js";
import AuthController from "../service/index.js";
import { PublishMessage, SubscribeMessage } from "../utils/index.js";

const { NOTIFICATION_SERVICE, FAULT_SERVICE } = configs;
export const auth = (app, channel) => {
  const authService = new AuthController();

  app.get("/", async (req, res, next) => {
    res.send("This is index route for Akili-employees");
  });

  // register new employee
  app.post("/employee", async (req, res, next) => {
    try {
      const {
        email,
        phone,
        name,
        username,
        address,
        password,
        businessId,
        salary,
        position
      } = req.body;
      const { data } = await authService.SignUp({
        email,
        phone,
        name,
        username,
        address,
        password,
        businessId,
        salary,
        position
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
  app.get("/employee/:id", async (req, res, next) => {
    try {
      const id = req.params.id;

      const { data } = await authService.GetProfile(id);

      return res.json(data);
    } catch (err) {
      next(err);
    }
  });

  // delete employee
  app.delete("/employee/:id", async (req, res, next) => {
    try {
      const id = req.params.id;

      const { data } = await authService.DeleteEmployee(id);
      if (data.profile === null) {
        return res.json({ msg: 'User not found' });
      } else {
        return res.json({ msg: data.msg });
      }
    } catch (err) {
      next(err);
    }
  });

  // GetAllEmployeesUsingAkili
  app.get("/employees", async (req, res, next) => {
    try {
      const { data } = await authService.GetEveryEmployees();
      return res.json(data);
    } catch (err) {
      next(err);
    }
  });

  // GetEveryEmployeesofaStore
  app.get("/employees/:id", async (req, res, next) => {
    try {
      const id = req.params.id;
      const { data } = await authService.GetEveryEmployeesofaStore(id);
      return res.json(data);
    } catch (err) {
      next(err);
    }
  });

  app.put("/editprofile", async (req, res, next) => {
    try {
      const {
        phone,
        name,
        username,
        address,
        password,
        businessId,
        salary,
        position } =
        req.body;

      const { data } = await authService.UpdateUserProfile({
        phone,
        name,
        username,
        address,
        password,
        businessId,
        salary,
        position
      });
      return res.json(data);
    } catch (err) {
      next(err);
    }
  });

};
