import userModel from "../models/user.model.js";
import ForgotPasswordOTP from "../models/ForgotPasswordOTP.model.js";
import { sendForgotPasswordOTP } from "../services/forgotPassword.service.js";

export const sendOTP = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }

        // Check if user exists
        const existingUser = await userModel.findOne({ email: email.toLowerCase() });

        if (!existingUser) {
            return res.status(404).json({ message: 'No account found with this email address' });
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

        // Delete any existing OTP for this email (for forgot password)
        await ForgotPasswordOTP.deleteMany({ email: email.toLowerCase() });

        // Store OTP in ForgotPasswordOTP collection
        await ForgotPasswordOTP.create({
            email: email.toLowerCase(),
            otp,
            expiresAt,
            isVerified: false,
        });

        // Send OTP email
        await sendForgotPasswordOTP(email, otp);

        return res.status(200).json({
            success: true,
            message: 'OTP sent successfully to your email',
        });

    } catch (err) {
        console.error('Send OTP error:', err);
        return res.status(500).json({ message: 'Failed to send OTP. Please try again.' });
    }
};

export const verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({ message: 'Email and OTP are required' });
        }

        // Validate OTP format (6 digits)
        if (!/^\d{6}$/.test(otp)) {
            return res.status(400).json({ message: 'Invalid OTP format' });
        }

        // Find OTP record
        const otpRecord = await ForgotPasswordOTP.findOne({
            email: email.toLowerCase(),
            otp,
        });

        if (!otpRecord) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        // Check if OTP has expired
        if (new Date() > otpRecord.expiresAt) {
            await ForgotPasswordOTP.deleteOne({ _id: otpRecord._id });
            return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
        }

        // Check if already verified
        if (otpRecord.isVerified) {
            return res.status(400).json({ message: 'OTP already used. Please request a new one.' });
        }

        // Mark OTP as verified (but don't delete yet - needed for password reset)
        otpRecord.isVerified = true;
        await otpRecord.save();

        return res.status(200).json({
            success: true,
            message: 'OTP verified successfully. You can now reset your password.',
        });

    } catch (err) {
        console.error('Verify OTP error:', err);
        return res.status(500).json({ message: 'Failed to verify OTP. Please try again.' });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;

        if (!email || !otp || !newPassword) {
            return res.status(400).json({ message: 'Email, OTP, and new password are required' });
        }

        // Validate password strength
        if (newPassword.length < 8) {
            return res.status(400).json({ message: 'Password must be at least 8 characters long' });
        }

        // Verify OTP is valid and verified
        const otpRecord = await ForgotPasswordOTP.findOne({
            email: email.toLowerCase(),
            otp,
            isVerified: true,
        });

        if (!otpRecord) {
            return res.status(400).json({ message: 'Invalid or unverified OTP. Please verify OTP first.' });
        }

        // Check if OTP has expired
        if (new Date() > otpRecord.expiresAt) {
            await ForgotPasswordOTP.deleteOne({ _id: otpRecord._id });
            return res.status(400).json({ message: 'OTP has expired. Please request a new one.' });
        }

        // Find user
        const user = await userModel.findOne({ email: email.toLowerCase() });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Hash new password
        const hashedPassword = await userModel.hashPassword(newPassword);

        // Update user password
        user.password = hashedPassword;
        await user.save();

        // Delete the used OTP record
        await ForgotPasswordOTP.deleteOne({ _id: otpRecord._id });

        return res.status(200).json({
            success: true,
            message: 'Password reset successfully. You can now login with your new password.',
        });

    } catch (err) {
        console.error('Reset password error:', err);
        return res.status(500).json({ message: 'Failed to reset password. Please try again.' });
    }
};
