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
        console.log("Contact form failed:", err);
        res.status(500).json({ message: "Could not send your message. Please try again." });
    }
}
