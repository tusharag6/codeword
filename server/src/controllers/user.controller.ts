import { Request, Response } from "express";
import { register, login } from "../services/user.services";
import { Files } from "../interfaces/File";
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
    const option = {
      httpOnly: true,
      secure: true,
    };
    res
      .cookie("refreshToken", user.tokens.refreshToken, option)
      .cookie("accessToken", user.tokens.accessToken, option)
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
const logoutUser = async (req: Request, res: Response) => {
  
};
export { registerUser, loginUser };
