import { Request, Response } from "express";
import { register, login } from "../services/auth.services";
import { Files } from "../interfaces/file.interfaces";
import { ApiError } from "../utils/ApiError";
import prisma from "../db";
import { CustomRequest } from "../interfaces/auth.interfaces";
import jwt from "jsonwebtoken";

const cookieOption = {
  httpOnly: true,
  secure: false,
  withCredentials: true,
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
  res.cookie("refreshToken", user.tokens.refreshToken, cookieOption);

  res.json(user.tokens.accessToken);
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
      .json({ message: "user logged out" });
  } catch (error) {
    console.log("Error", error);

    res.status(401).json({ message: "Unauthorized" });
  }
};

const refreshToken = async (req: Request, res: Response) => {
  const refreshToken = req.cookies?.refreshToken;

  if (!refreshToken) {
    throw new ApiError(401, "Refresh token not found");
  }

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET as string,
    async (err: any, decoded: any) => {
      if (err) {
        throw new ApiError(403, "Invalid or expired refresh token");
      }

      const user = await prisma.user.findUnique({
        where: { id: decoded.id },
      });

      if (!user) {
        throw new ApiError(404, "User not found");
      }

      const accessToken = jwt.sign(
        {
          id: user.id,
          email: user.email,
          username: user.username,
        },
        process.env.ACCESS_TOKEN_SECRET as string,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
      );
      console.log(accessToken);

      res.json({ accessToken });
    }
  );
};

const getUserInfo = async (req: CustomRequest, res: Response) => {
  const accessToken = req.headers.authorization?.split(" ")[1];
  console.log(accessToken);

  if (!accessToken) {
    throw new ApiError(401, "Access token not provided");
  }

  jwt.verify(
    accessToken,
    process.env.ACCESS_TOKEN_SECRET as string,
    async (err: any, decoded: any) => {
      try {
        if (err) {
          console.log(".....", err);

          res.status(401).json({ message: "Invalid or expired access token" });
          // throw new ApiError(401, "Invalid or expired access token");
        }
        if (!decoded) {
          res.sendStatus(401).json("Decoded Undefined");
        }
        const user = await prisma.user.findUnique({
          where: { id: decoded.id },
        });

        if (!user) {
          throw new ApiError(404, "User not found");
        }

        const now = Math.floor(Date.now() / 1000);
        if (decoded.exp < now) {
          throw new ApiError(401, "Access token has expired");
        }

        res.json({
          id: user.id,
          email: user.email,
          username: user.username,
        });
      } catch (error) {
        console.log("Catch Error", error);
      }
    }
  );
};

export { registerUser, loginUser, logoutUser, refreshToken, getUserInfo };
