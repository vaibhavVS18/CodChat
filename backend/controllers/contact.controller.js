import { validationResult } from "express-validator";
import * as contactService from "../services/contact.service.js";

export const sendMessageController = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { name, email, message } = req.body;
        await contactService.sendContactEmail({ name, email, message });
        res.status(200).json({ message: "Message sent successfully" });
    }
    catch (err) {
        // nodemailer puts the useful bits on these fields, not on err.message
        console.log("Contact form failed:", {
            code: err.code,
            command: err.command,
            responseCode: err.responseCode,
            response: err.response,
            message: err.message,
            port: process.env.EMAIL_PORT,
            host: process.env.EMAIL_HOST,
            userSet: Boolean(process.env.EMAIL_USER),
            passSet: Boolean(process.env.EMAIL_PASS),
        });
        res.status(500).json({ message: "Could not send your message. Please try again." });
    }
}
