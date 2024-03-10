import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshToken,
} from "../controllers/auth.controller";
import { upload } from "../middlewares/multer.middlewares";
import { verifyJwt } from "../middlewares/auth.middlewares";
const router = Router();

router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
  ]),
  registerUser
);
router.route("/login").post(loginUser);
router.route("/logout").post(verifyJwt, logoutUser);
router.route("/refresh").get(refreshToken);
export default router;
