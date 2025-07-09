import User from "../Models/user.model.js";
import jwt from "jsonwebtoken";

export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if (!token) {
            return res.status(401).json({ error: "Unauthorized: No Token Provided" });
        }

        if (!process.env.JWT_SECRET) {
            console.error("CRITICAL: JWT_SECRET is not defined in environment variables!");
            // In a real scenario, you might not want to expose "Configuration issue" to client for security.
            // But for debugging, it's useful. Server should ideally not start if JWT_SECRET is missing.
            return res.status(500).json({ error: "Internal Server Error: Server configuration issue." });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded || !decoded.userId) {
            return res.status(401).json({ error: "Unauthorized: Invalid token payload." });
        }

        // Fetch user and also check if it's active (isActive field added in new User model)
        const user = await User.findById(decoded.userId).select("-password -emailVerificationOTP -passwordResetOTP");

        if (!user) {
            // User associated with token not found, clear cookie
            res.clearCookie("jwt", { httpOnly: true, sameSite: "strict", secure: process.env.NODE_ENV !== "development" });
            return res.status(401).json({ error: "Unauthorized: User for this token not found." });
        }

        // Check if user account is active
        if (!user.isActive) {
            res.clearCookie("jwt", { httpOnly: true, sameSite: "strict", secure: process.env.NODE_ENV !== "development" });
            return res.status(403).json({ error: "Forbidden: Your account has been deactivated." });
        }

        // Check if user email is verified, if your app requires it for most actions
        // This can be made more granular, e.g. some routes accessible without verification
        if (!user.isVerified) {
            // Allow access to /api/auth/me, /api/auth/resend-verification-email, /api/auth/verify-email
            const allowedUnverifiedPaths = ["/api/auth/me", "/api/auth/resend-verification-email", "/api/auth/verify-email", "/api/auth/logout"];
            if (!allowedUnverifiedPaths.includes(req.originalUrl)) {
                 return res.status(403).json({ error: "Forbidden: Please verify your email address to access this resource.", action: "VERIFY_EMAIL" });
            }
        }


        req.user = user;
        next();
    } catch (error) {
        console.error("Error in protectRoute middleware:", error.message); // Use console.error for errors
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ error: "Unauthorized: Invalid or malformed token." });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: "Unauthorized: Your session has expired. Please login again." });
        }
        // Default to 500 for other unexpected errors
        return res.status(500).json({ error: "Internal Server Error" });
    }
};