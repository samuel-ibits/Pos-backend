import ClientService from "../service/clientServices.js";

export const appEvents = (app) => {
  const service = new ClientService();

  app.use("/app-events", async (req, res, next) => {
    const { payload } = req.body;

    service.SubscribeEvents(payload);

    console.log(
      "===============  client-management Service Received Event ====== "
    );
    return res.status(200).json(payload);
  });
};
