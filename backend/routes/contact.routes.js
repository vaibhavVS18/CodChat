import { Router } from "express";
import { body } from "express-validator";
import * as contactController from "../controllers/contact.controller.js";

const router = Router();

router.post("/send",
    body("name").trim().notEmpty().withMessage("Name is required")
        .isLength({ max: 100 }).withMessage("Name is too long"),
    body("email").isEmail().withMessage("Email must be a valid email address"),
    body("message").trim().notEmpty().withMessage("Message is required")
        .isLength({ max: 5000 }).withMessage("Message is too long"),
    contactController.sendMessageController
);

export default router;
