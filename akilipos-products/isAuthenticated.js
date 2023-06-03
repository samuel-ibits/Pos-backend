import jwt from "jsonwebtoken";
export const ValidateSignature = async (req) => {
  const signature = req.get("Authorization");

  if (signature) {
    const payload = await jwt.verify(signature.split(" ")[1], APP_SECRET);
    req.user = payload;
    return true;
  }

  return false;
};
export const IsAuthenticated = async (req, res, next) => {
  // const token = req.Headers["Authorization"]?.split(" ")[1];
  const token = req.get("Authorization");

  await jwt.verify(token.split(" ")[1], process.env.APP_SECRET, (err, user) => {
    if (err) {
      return res.status(401).send({ message: "Invalid Authorization" });
    } else {
      req.user = user;
      next();
    }
  });
};
