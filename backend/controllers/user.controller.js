import userModel from "../models/user.model.js";
import * as userService from "../services/user.service.js";
import { validationResult } from "express-validator";
import redisClient from "../services/redis.service.js";
import OTPVerification from "../models/otp.model.js";
import { sendOTPEmail } from "../services/email.service.js";

export const createUserController = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const user = await userService.createUser(req.body);

        const token = await user.generateJWT();

        delete user._doc.password;    // bcoz we don't want password to be sent to frontend even if it hashed
        res.status(201).json({ user, token });
    } catch (error) {
        res.status(400).send(error.message);
    }
}

export const loginController = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email }).select("+password");   // .select bcoz in schema we have used passsword select false

        if (!user) {
            return res.status(401).json({
                errors: "Invalid credentials"
            })
        }

        const isMatch = await user.isValidPassword(password);
        if (!isMatch) {
            return res.status(401).json({
                errors: "Invalid credentials"
            })
        }

        const token = await user.generateJWT();

        res.status(200).json({ user, token });
    }
    catch (err) {
        res.status(400).send(err.message);
    }
}

export const profileController = async (req, res) => {
    // console.log(req.user);
    const email = req.user.email;
    const user = await userModel.findOne({ email });   // .select bcoz in schema we have used passsword select false


    res.status(200).json({ user: user });
}

export const logoutController = async (req, res) => {
    try {
        const token = req.cookies.token || req.headers.authorization.split(" ")[1];
        redisClient.set(token, "logout", "EX", 60 * 60 * 24);

        res.status(200).json({
            message: "logged ot successfully"
        });

    } catch (err) {
        console.log(err);
        res.status(400).send(err.message);
    }
}

export const getAllUsersController = async (req, res) => {
    const { projectId } = req.query;
    try {
        const loggedInUser = await userModel.findOne({
            email: req.user.email
        })

        const allUsers = await userService.getAllUsers({ userId: loggedInUser._id, projectId });

        return res.status(200).json({
            users: allUsers,
        })
    }
    catch (err) {
        console.log(err);
        res.status(400).json({ errors: err.message });
    }
}

export const sendOTPController = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { email } = req.body;

        // Check if email already exists
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: 'Email already registered' });
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        // Delete any existing OTP for this email
        await OTPVerification.deleteMany({ email });

        // Store OTP in database
        await OTPVerification.create({
            email,
            otp,
            expiresAt,
        });

        // Send OTP email
        await sendOTPEmail(email, otp);

        res.status(200).json({
            success: true,
            message: 'OTP sent successfully to your email',
        });
    }
    catch (err) {
        console.error('Send OTP error:', err);
        res.status(500).json({ message: 'Failed to send OTP' });
    }
}

export const verifyOTPController = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { email, otp } = req.body;

        // Find the OTP record
        const otpRecord = await OTPVerification.findOne({
            email,
            otp,
            expiresAt: { $gt: new Date() } // Not expired
        });

        if (!otpRecord) {
            return res.status(401).json({ message: 'Invalid or expired OTP' });
        }

        // OTP is valid - don't delete it yet (will be deleted during signup)
        res.status(200).json({
            success: true,
            message: 'OTP verified successfully',
        });
    }
    catch (err) {
        console.error('Verify OTP error:', err);
        res.status(500).json({ message: 'Failed to verify OTP' });
    }
}
