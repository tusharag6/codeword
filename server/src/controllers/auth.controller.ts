import { Request, Response } from "express";
import { register, login } from "../services/auth.services";
import { Files } from "../interfaces/File";
import prisma from "../db";
import { CustomRequest } from "../interfaces/auth";
const cookieOption = {
  httpOnly: true,
  secure: true,
};
const registerUser = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;
    let avatarPath = (req.files as Files)?.avatar?.[0]?.path;
    if (
      [username, email, password].some((fields) => {
        fields?.trim() === "";
      })
    ) {
      throw new Error("All fields are required");
    }
    if (!avatarPath) {
      avatarPath = "";
    }
    const user = await register(username, email, password, avatarPath);
    if (!user) {
      throw new Error("Error creating user");
    }
    res.status(201).json({
      message: "User created",
      user: user,
    });
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({
      message: "Error creating user",
    });
  }
};
const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (
      [email, password].some((fields) => {
        fields?.trim() === "";
      })
    ) {
      throw new Error("All fields are required");
    }
    const user = await login(email, password);
    if (!user?.loggedUser) {
      throw new Error("No user found");
    }
    res
      .cookie("refreshToken", user.tokens.refreshToken, cookieOption)
      .cookie("accessToken", user.tokens.accessToken, cookieOption)
      .status(201)
      .json({
        message: "logged in",
      });
  } catch (error) {
    console.log("Error:", error);
    res.status(500).json({
      message: "Server Error",
    });
  }
};
const logoutUser = async (req: CustomRequest, res: Response) => {
  await prisma.user.update({
    where: {
      id: req.user?.id,
    },
    data: {
      refreshToken: "",
    },
  });
  res
    .status(201)
    .clearCookie("refreshToken")
    .clearCookie("accessToken")
    .json({ message: "user logged out" });
};
export { registerUser, loginUser, logoutUser };
