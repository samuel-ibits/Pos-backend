import { configs } from "../config/index.js";
import AuthController from "../service/index.js";
import {
  PublishMessage,
  SubscribeMessage,
  uploadTwo,
  UploadImage,
} from "../utils/index.js";

const { NOTIFICATION_SERVICE, FAULT_SERVICE } = configs;
export const auth = (app, channel) => {
  const authService = new AuthController();

  app.get("/register", async (req, res, next) => {
    res.send("api working");
  });

  app.post("/register", async (req, res, next) => {
    try {
      const { address, email, password, phone, businessName, userName } =
        req.body;
      const { data } = await authService.SignUp({
        email,
        password,
        businessName,
        userName,
        address,
        phone,
      });

      const payload = { event: "SIGNUP_USER", data: data };
      PublishMessage(channel, NOTIFICATION_SERVICE, JSON.stringify(payload));
      res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  });

  app.post("/login", async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const { data } = await authService.Login({ email, password });
      const payload = { event: "LOGIN_USER", data: data };
      PublishMessage(channel, NOTIFICATION_SERVICE, JSON.stringify(payload));
      res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  });

  app.get("/fetchUser/:id", async (req, res, next) => {
    try {
      const id = req.params.id;

      const { data } = await authService.GetProfile({ id });

      return res.json(data);
    } catch (err) {
      next(err);
    }
  });

  app.get("/business", async (req, res, next) => {
    try {
      const { data } = await authService.GetAllBusiness();

      return res.json(data);
    } catch (err) {
      next(err);
    }
  });

  app.patch("/edit-business/:id", async (req, res, next) => {
    try {
      const businessId = req.params.id;
      const { password, phone, address, coinValue, coinName, userName } =
        req.body;

      const { data } = await authService.UpdateBusiness({
        businessId,
        password,
        phone,
        address,
        coinValue,
        coinName,
        userName,
      });
      return res.json(data);
    } catch (err) {
      next(err);
    }
  });

  app.patch(
    "/update-logo/:id",
    uploadTwo.single("image"),
    async (req, res, next) => {
      console.log("yeah req file");
      const businessId = req.params.id;
      if (req.file) {
        console.log("yeah req file");
        var localFilePath = req.file.path;
        let result = await UploadImage(localFilePath);
        console.log(result, "from result");
        try {
          console.log(result.url, "from result url");
          const data = await authService.UpdateLogo({
            businessId,
            logo: result.url,
          });
          console.log(data);
          return res
            .status(200)
            .json({ msg: "updated logo successfully updated" });
        } catch (err) {
          console.log(err);
          return res.status(500).json({ msg: err.message });
        }
      } else {
        console.log("no req file");
        return;
      }
    }
  );

  // vendors endpoints
  app.post("/register-vendor", async (req, res, next) => {
    try {
      const {
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        phone,
        zone,
        address,
        city,
        state,
      } = req.body;
      const { data } = await authService.VendorSignUp({
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        phone,
        address,
        zone,
        city,
        state,
      });

      const payload = { event: "SIGNUP_VENDOR", data: data };
      PublishMessage(channel, NOTIFICATION_SERVICE, JSON.stringify(payload));
      res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  });

  app.post("/vendor-login", async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const { data } = await authService.VendorLogin({ email, password });
      const payload = { event: "LOGIN_USER", data: data };
      PublishMessage(channel, NOTIFICATION_SERVICE, JSON.stringify(payload));
      res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  });

  app.get("/fetchVendor/:id", async (req, res, next) => {
    try {
      const id = req.params.id;

      const { data } = await authService.GetVendorProfile({ id });

      return res.json(data);
    } catch (err) {
      next(err);
    }
  });

  app.put("/edit-vendor-profile", async (req, res, next) => {
    try {
      // const { userId, name, email, phone, address, gender, birthday, state } =
      //   req.body;

      // const { data } = await authService.UpdateVendorProfile({
      //   name,
      //   email,
      //   phone,
      //   address,
      //   gender,
      //   birthday,
      //   state,
      //   userId,
      // });

      const data = await authService.UpdateVendorProfile(...req.body);
      return res.json({ msg: "Update successful" });
    } catch (err) {
      next(err);
    }
  });
  app.get("/", (req, res) => {
    res.send(
      "this is index route for auth services, welcome to your Akili auth services endpoints"
    );
  });
};
