import { Router } from "express";
import * as userController from "../controllers/user.controller.js";
import { body } from "express-validator";
import * as authMiddleware from "../middleware/auth.middleware.js"

const router = Router();

router.post("/send-otp",
    body("email").isEmail().withMessage("Email must be a valid email address"),
    userController.sendOTPController
);

router.post("/verify-otp",
    body("email").isEmail().withMessage("Email must be a valid email address"),
    body("otp").isLength({ min: 6, max: 6 }).withMessage("OTP must be 6 digits"),
    userController.verifyOTPController
);

router.post("/register",
    body("email").isEmail().withMessage("Email must be a vaild email address"),
    body("password").isLength({ min: 3 }).withMessage("password must be at least 3 characters long"),
    body("otp").isLength({ min: 6, max: 6 }).withMessage("OTP must be 6 digits"),
    userController.createUserController
);



router.post("/login",
    body('email').isEmail().withMessage('Email must be a valid email address'),
    body('password').isLength({ min: 3 }).withMessage('Password must be at least 3 characters long'),
    userController.loginController
);

router.get("/profile", authMiddleware.authUser, userController.profileController);

router.get("/logout", authMiddleware.authUser, userController.logoutController);   //change it to POST req. later


router.get("/all", authMiddleware.authUser, userController.getAllUsersController);

export default router;