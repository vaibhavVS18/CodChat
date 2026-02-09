import userModel from "../models/user.model.js";

export const resetPassword = async (req, res) => {
    try {
        const { email, newPassword } = req.body;

        if (!email || !newPassword) {
            return res.status(400).json({ message: 'Email and new password are required' });
        }

        // Validate password strength
        if (newPassword.length < 8) {
            return res.status(400).json({ message: 'Password must be at least 8 characters long' });
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

        return res.status(200).json({
            success: true,
            message: 'Password reset successfully. You can now login with your new password.',
        });

    } catch (err) {
        console.error('Reset password error:', err);
        return res.status(500).json({ message: 'Failed to reset password. Please try again.' });
    }
};
