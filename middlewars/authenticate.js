import { HttpError } from "../helpers/index.js";
import jwt from "jsonwebtoken";
import "dotenv/config";
import User from "../models/users.js";

const { JWT_SECRET } = process.env;

const authenticate = async (req, res, next) => {
  try {
    const { authorization = "" } = req.headers;
    const { bearer, token } = authorization.split(" ");
    if (bearer !== "Bearer") {
      throw HttpError(401, error.message);
    }

    try {
      const { id } = jwt.verify(token, JWT_SECRET);
      const user = await User.findById(id);
      if (!user || user.token) {
        throw HttpError(401, error.message);
      }
      next();
    } catch (error) {
      throw HttpError(401, error.message);
    }
  } catch (error) {
    next(error);
  }
};

export default authenticate;