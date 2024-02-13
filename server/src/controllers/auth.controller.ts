import { Request, Response } from "express";
import { register, login } from "../services/auth.services";
import { Files } from "../interfaces/file.interfaces";
import { ApiError } from "../utils/ApiError";
import prisma from "../db";
import { CustomRequest } from "../interfaces/auth.interfaces";
const cookieOption = {
  httpOnly: true,
  secure: true,
};
const registerUser = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;
  let avatarPath = (req.files as Files)?.avatar?.[0]?.path;
  if (
    [username, email, password].some((fields) => {
      fields?.trim() === "";
    })
  ) {
    throw new ApiError(400, "All Fields are required");
  }
  if (!avatarPath) {
    avatarPath = "";
  }
  const user = await register(username, email, password, avatarPath);
  if (!user) {
    throw new ApiError(500, "Internal Server Error");
  }
  res.status(201).json({
    message: "User created",
  });
};
const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (
    [email, password].some((fields) => {
      fields?.trim() === "";
    })
  ) {
    throw new ApiError(400, "All Fields are required");
  }
  const user = await login(email, password);
  if (!user?.loggedUser) {
    throw new ApiError(404, "User not found");
  }
  res
    .cookie("refreshToken", user.tokens.refreshToken, cookieOption)
    .cookie("accessToken", user.tokens.accessToken, cookieOption)
    .status(201)
    .json({
      message: "logged in",
    });
};
const logoutUser = async (req: CustomRequest, res: Response) => {
  try {
    await prisma.user.update({
      where: {
        id: req.user?.id,
      },
      data: {
        refreshToken: null,
      },
    });
    res
      .status(201)
      .clearCookie("refreshToken")
      .clearCookie("accessToken")
      .json({ message: "user logged out" });
  } catch (error) {
    console.log("Error:", error);
  }
};
export { registerUser, loginUser, logoutUser };