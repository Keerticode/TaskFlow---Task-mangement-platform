import { Router } from "express";
import {
    register,
    login,
    logout,
    getCurrentUser,
    changeCurrentPassword,
    refreshaccessToken,
    updateuserDetails
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

// Public routes
router.route("/register").post(register);
router.route("/login").post(login);
router.route("/refresh-token").post(refreshaccessToken);

// Protected routes
router.route("/logout").post(verifyJWT, logout);
router.route("/current-user").get(verifyJWT, getCurrentUser);
router.route("/change-password").patch(verifyJWT, changeCurrentPassword);
router.route("/update-details").patch(verifyJWT, updateuserDetails);

export default router;