import { Request, Response } from "express";
import { register } from "../services/user.services";
import { uploadOnCloudinary } from "../utils/cloudinary";
interface File {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  path: string;
}
interface Files {
  avatar?: File[];
}
const registerUser = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;
    let avatarPath = (req.files as Files)?.avatar?.[0]?.path;
    // console.log("%s %s %s", username, email, password);
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
    const avatarUrl = await uploadOnCloudinary(avatarPath);
    const user = await register(username, email, password, avatarUrl?.url);
    if (!user) {
      throw new Error("Error creating user");
    }
    res.status(201).json({
      message: "User created",
    });
  } catch (error) {
    console.log("Error:", error);
  }
};

export { registerUser };
