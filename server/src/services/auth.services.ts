import prisma from "../db";
import bcrypt from "bcrypt";
import jwt, { Secret } from "jsonwebtoken";
import { generateDiscriminator } from "../utils/generateDiscriminator";
import { uploadOnCloudinary } from "../utils/cloudinary";
const generateTokens = (user: any) => {
  const secret: any = process.env.ACCESS_TOKEN_SECRET;
  const accessToken = jwt.sign(
    {
      id: user.id,
      email: user.email,
      username: user.username,
    },
    secret,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
  const refreshToken = jwt.sign(
    {
      id: user.id,
    },
    secret,
    {
      expiresIn: process.env.REFRESG_TOKEN_EXPIRY,
    }
  );
  return { accessToken, refreshToken };
};
const findEmail = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  return user;
};
const register = async (
  username: string,
  email: string,
  password: string,
  avatarPath: string
) => {
  try {
    const existingUser = await findEmail(email);
    if (existingUser) {
      throw new Error("Email already exists");
    }
    const avatarUrl = await uploadOnCloudinary(avatarPath);
    const hashedPass = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPass,
        username,
        avatarUrl: avatarUrl?.url,
        discriminator: generateDiscriminator().toString(),
      },
    });
    console.log(user);
    return user;
  } catch (error) {
    console.log("Error:", error);
  }
};
const login = async (email: string, password: string) => {
  try {
    const findUser = await findEmail(email);
    if (!findUser) {
      throw new Error("User does not exist");
    }
    const pass = await bcrypt.compare(password, findUser.password);
    if (!pass) {
      throw new Error("Invalid password");
    }
    const tokens = generateTokens(findUser);
    const loggedUser = await prisma.user.update({
      where: {
        email: findUser.email,
      },
      data: {
        refreshToken: tokens.refreshToken,
      },
    });
    return { loggedUser, tokens };
  } catch (error) {
    console.log("Error:", error);
  }
};
export { register, login };
