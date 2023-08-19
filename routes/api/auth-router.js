import express from "express";
import authController from "../../controllers/auth-controller.js";
import { validateBody } from "../../decorators/index.js";
import usersSchema from "../../schemas/users-schema.js";
import {authenticate, upload} from "../../middlewars/index.js"

const authRouter = express.Router();

authRouter.post('/register', upload.single("avatars"), validateBody(usersSchema), authController.signup);
authRouter.get('/verify/:verificationToken', authController.verify);
authRouter.post('/verify',validateBody(usersSchema.userEmailSchema), authController.resendVerifyEmail)
authRouter.post('/login', validateBody(usersSchema), authController.signin);
authRouter.get('/current', authenticate, authController.getCurrent);
authRouter.post('/logout', authenticate, authController.logout);
authRouter.patch('/avatars', authenticate, upload.single('avatar'), authController.updateAvatar);

export default authRouter;