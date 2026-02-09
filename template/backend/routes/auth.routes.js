import { Router } from "express";
import passport from "passport";
import { sendOTP, verifyOTP, resetPassword } from "../controllers/forgotPassword.controller.js";

const router = Router();

router.get("/google", (req, res, next) => {
    passport.authenticate("google", {
        scope: ["profile", "email"],
        session: false,
        state: req.query.state     //redirectPage passing in state
    })(req, res, next);  // ✅ Fixed: Now properly invokes the middleware
});


router.get("/google/callback",
    passport.authenticate("google", {
        failureRedirect: "/login",
        session: false,
    }),
    async (req, res) => {
        try {
            // console.log(req.user);

            const token = req.user.generateJWT();
            const redirectPage = req.query.state || "/";
            res.redirect(`${process.env.FRONTEND_URL}?token=${token}&redirectPage=${redirectPage}`);
        } catch (error) {
            console.error("Google OAuth callback error:", error);
            res.redirect(`${process.env.FRONTEND_URL}/login?error=auth_failed`);
        }
    }
);

// Forgot Password Routes
router.post("/forgot-password/send-otp", sendOTP);
router.post("/forgot-password/verify-otp", verifyOTP);
router.post("/forgot-password/reset-password", resetPassword);

export default router;