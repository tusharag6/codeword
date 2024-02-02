import prisma from "../db";
import bcrypt from "bcrypt";
import { generateDiscriminator } from "../utils/generateDiscriminator";
const isEmailTaken = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });
  if (user) {
    return true;
  }
  return false;
};
const register = async (
  username: string,
  email: string,
  password: string,
  avatarUrl: any
) => {
  try {
    const existingUser = await isEmailTaken(email);
    if (existingUser) {
      throw new Error("Email already exists");
    }
    const hashedPass = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPass,
        username,
        avatarUrl: avatarUrl,
        discriminator: generateDiscriminator().toString(),
      },
    });
    console.log(user);
    return user;
  } catch (error) {
    console.log("Error:", error);
  }
};
export { register };
