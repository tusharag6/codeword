import jwt, { JwtPayload } from "jsonwebtoken";
import { NextFunction, Response } from "express";
import { CustomRequest } from "../interfaces/auth.interfaces";
const secret: any = process.env.ACCESS_TOKEN_SECRET;
export const verifyJwt = async (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new Error("Token Not Found");
    }

    let decodeToken: JwtPayload | string;
    try {
      decodeToken = jwt.verify(token, secret);
    } catch (error) {
      throw new Error("Token Expired");
    }
    if (typeof decodeToken === "string") {
      throw new Error("Token Type Error");
    }
    req.user = decodeToken;
    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
    // console.log("Error", error);
  }
};
