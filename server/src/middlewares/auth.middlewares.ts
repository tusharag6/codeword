import jwt, { JwtPayload } from "jsonwebtoken";
import { NextFunction, Response } from "express";
import { CustomRequest } from "../interfaces/auth.interfaces";
const secret: any = process.env.ACCESS_TOKEN_SECRET;
export const verifyJwt = async (
  req: CustomRequest,
  _: Response,
  next: NextFunction
) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      throw new Error("Invalid access token");
    }
    let decodeToken: JwtPayload | string;
    try {
      decodeToken = jwt.verify(token, secret);
    } catch (error) {
      throw new Error("Invalid access token");
    }
    if (typeof decodeToken === "string") {
      throw new Error("Invalid access token");
    }
    req.user = decodeToken;
    next();
  } catch (error) {
    console.log("Error", error);
  }
};
