import prisma from "../db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { generateDiscriminator } from "../utils/generateDiscriminator";
import { uploadOnCloudinary } from "../utils/cloudinary";
import { ApiError } from "../utils/ApiError";
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
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
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
      throw new ApiError(401, "Email already exists");
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
    return user;
  } catch (error) {
    console.log(error)
  }
};
const login = async (email: string, password: string) => {
  const findUser = await findEmail(email);
  if (!findUser) {
    throw new ApiError(404, "User does not exist");
  }
  const pass = await bcrypt.compare(password, findUser.password);
  if (!pass) {
    throw new ApiError(401, "Invalid password");
  }
  const tokens = generateTokens(findUser);
  const loggedUser = await prisma.user.update({
    where: {
      id: findUser.id,
    },
    data: {
      refreshToken: tokens.refreshToken,
    },
  });
  return { loggedUser, tokens };
};
export { register, login };
