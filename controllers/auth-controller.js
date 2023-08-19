import User from "../models/user.js";
import jwt from "jsonwebtoken";
import { nanoid } from "nanoid";
import { HttpError, createVerifyEmail, sendEmail } from "../helpers/index.js";
import bcrypt from "bcryptjs";
import "dotenv/config";
import fs from "fs/promises";
import path from "path";
import gravatar from "gravatar";
import Jimp from "jimp";
import { json } from "express";

const avatarPath = path.resolve("public", "avatars");

const { JWT_SECRET } = process.env;

const signup = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      throw HttpError(409, "Email in use");
    }

    const avatarURL = gravatar.url(email);
    const hashPassword = await bcrypt.hash(password, 10);
    const verificationToken = nanoid();
    const newUser = await User.create({
      ...req.body,
      password: hashPassword,
      avatarURL,
      verificationToken,
    });
    const verifyEmail = createVerifyEmail({ email, verificationToken });
    await sendEmail(verifyEmail);

    res.status(201).json({
      name: newUser.name,
      email: newUser.email,
    });
  } catch (error) {
    next(error);
  }
};

const verify = async (req, res) => {
  const { verificationToken } = req.params;
  const user = await User.findOne({ verificationToken });
  if (!user) {
    throw HttpError(404, "Not found");
  }
  await User.findByIdAndUpdate(user._id, {
    verify: true,
    verificationToken: " ",
  });
  res.json({
    message: "Verify succes",
  });
};

const resendVerifyEmail = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(404, "Not found");
  }
  if (user.verify) {
    throw HttpError(400, "Verification has already been passed");
  }
  const verifyEmail = createVerifyEmail({
    email,
    verificationToken: user.verificationToken,
  });
  await sendEmail(verifyEmail);
  res.json({
    message: "Resend email succes",
  });
};

const signin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      throw HttpError(401, "Email or password invalid");
    };
    if (!user.verify) {
      throw HttpError(404, "User not found");
    };
    const passwordCompare = await bcrypt.compare(password, user.password);
    if (!passwordCompare) {
      throw HttpError(401, "Email or password invalid");
    };
    const payload = {
      id: user._id,
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "23h" });
    await User.findByIdAndUpdate(user._id, { token });

    res.json({
      token,
    });
  } catch (error) {
    next(error);
  }
};

const getCurrent = async (req, res, next) => {
  try {
    const { name, email, subscription } = req.user;
    const user = await User.findOne({ email });
    if (!user) {
      throw HttpError(401, "Not authorized");
    }

    res.json({
      name,
      email,
      subscription,
    });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    const { _id } = req.user;
    await User.findByIdAndUpdate(_id, { token: "" });

    res.status(204).json({
      message: "No Content",
    });
  } catch (error) {
    next(error);
  }
};

const updateAvatar = async (req, res, next) => {
  try {
    const { user } = req;
    const { path: oldPath, filename } = req.file;

    const image = await Jimp.read(oldPath);
    await image.resize(250, 250).writeAsync(oldPath);

    const newPath = path.join(avatarPath, filename);
    await fs.rename(oldPath, newPath);

    const avatarURL = `/avatars/${filename}`;
    await User.findByIdAndUpdate(user._id, { avatarURL });

    res.json({
      avatarURL,
    });
  } catch (error) {
    next(error);
  }
};
export default {
  signup,
  verify,
  resendVerifyEmail,
  signin,
  getCurrent,
  logout,
  updateAvatar,
};
