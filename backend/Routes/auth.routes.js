import express from "express";
import {
    signup,
    login,
    logout,
    getMe,
    verifyEmail,
    resendVerificationEmail,
    requestPasswordReset,
    resetPassword
} from "../Controllers/auth.controller.js";
import { protectRoute } from '../middleware/protectRoute.js';
import rateLimit from "express-rate-limit";

// General limiter for auth routes
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // Limit each IP to 10 requests per windowMs for sensitive operations
    message: "Too many requests from this IP, please try again after 15 minutes.",
    standardHeaders: true,
    legacyHeaders: false,
});

// Stricter limiter for OTP generation to prevent abuse
const otpLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 5, // Limit each IP to 5 OTP requests per windowMs
    message: "Too many OTP requests from this IP, please try again after 10 minutes.",
    standardHeaders: true,
    legacyHeaders: false,
});

const router = express.Router();

// Existing routes
router.get("/me", protectRoute, getMe);
router.post("/signup", authLimiter, signup); // Apply general auth limiter
router.post("/login", authLimiter, login);   // Apply general auth limiter
router.post("/logout", logout); // Logout doesn't usually need strict rate limiting

// New Email Verification Routes
router.post("/verify-email", verifyEmail); // Potentially add a limiter if abused
router.post("/resend-verification-email", otpLimiter, resendVerificationEmail); // Stricter limit for OTP generation

// New Password Reset Routes
router.post("/request-password-reset", otpLimiter, requestPasswordReset); // Stricter limit for OTP generation
router.post("/reset-password", authLimiter, resetPassword); // General auth limiter for the reset action

export default router;