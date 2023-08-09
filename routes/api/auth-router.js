import express from "express";
import authController from "../../controllers/auth-controller.js";
import { validateBody } from "../../decorators/index.js";
import usersSchema from "../../schemas/users-schema.js";
import {authenticate} from "../../middlewars/index.js"

const authRouter = express.Router();

authRouter.post('/register', validateBody(usersSchema), authController.signup);
authRouter.post('/login', validateBody(usersSchema), authController.signin);
authRouter.get('/current', authenticate, authController.getCurrent);
authRouter.post('/logout', authenticate, authController.logout);

export default authRouter;