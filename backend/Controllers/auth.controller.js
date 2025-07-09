import User from "../Models/user.model.js";
import bcrypt from "bcryptjs";
import crypto from "crypto"; // For OTP generation
import { generateTokenAndSetCookie } from "../lib/utils/generateToken.js";
// import { sendVerificationEmail, sendPasswordResetEmail } from "../services/emailService.js"; // Placeholder for email service

// Helper function to generate OTP
const generateOTP = () => {
    return crypto.randomBytes(3).toString('hex').toUpperCase(); // Generates a 6-character hex OTP
};

export const signup = async (req, res) => {
    try {
        const { fullName, username, email, password, role } = req.body; // Changed userType to role

        if (!fullName || !username || !email || !password || !role) { // Added role to required fields
            return res.status(400).json({ error: "All fields (fullName, username, email, password, role) are required" });
        }

        if (!["jobSeeker", "employer", "admin"].includes(role)) {
            return res.status(400).json({ error: "Invalid role specified. Must be jobSeeker, employer, or admin." });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Corrected regex
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: "Invalid email format" });
        }

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: "Username is already taken" });
        }

        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ error: "Email is already taken" });
        }

        if (password.length < 6) { // Consider increasing to 8 based on new schema
            return res.status(400).json({ error: "Password must be at least 6 characters long" });
        }

        // const salt = await bcrypt.genSalt(12); // Salt generation is handled by pre-save hook in user.model.js
        // const hashPassword = await bcrypt.hash(password, salt); // Password hashing is handled by pre-save hook

        const emailOtp = generateOTP();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // OTP valid for 10 minutes

        const newUser = new User({
            username,
            fullName,
            email,
            password, // Pass plain password, hashing is done by pre-save hook
            role, // Changed from userType
            isVerified: false,
            emailVerificationOTP: { otp: emailOtp, expiresAt: otpExpiry },
        });

        if (newUser) {
            // await sendVerificationEmail(newUser.email, emailOtp); // Send verification email - Placeholder
            console.log(`Verification OTP for ${newUser.email}: ${emailOtp}`); // Log OTP for dev

            generateTokenAndSetCookie(newUser._id, res);
            await newUser.save();

            // Exclude sensitive fields from the response
            const { password: pass, emailVerificationOTP: otp, passwordResetOTP: pOtp, ...rest } = newUser._doc;

            return res.status(201).json(rest); // Changed to 201 for resource creation

        } else {
            res.status(400).json({ error: "Invalid user data" });
        }

    } catch (error) {
        res.status(500).json({ error: "Internal server error in signup" }); // More specific error
        console.log(`Error occurred in the signup controller: ${error.message}`);
    }
};

export const login = async (req, res) => {
    try {
        const { usernameOrEmail, password } = req.body;

        if (!usernameOrEmail || !password) {
            return res.status(400).json({ error: "Both username/email and password are required" });
        }
        const user = await User.findOne({
            $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }]
        }).select("+password"); // Explicitly select password for comparison

        if (!user) {
            return res.status(401).json({ error: "Invalid username/email or password" }); // Changed to 401
        }

        const isMatch = await user.comparePassword(password); // Use instance method
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid username/email or password" }); // Changed to 401
        }

        if (!user.isVerified) {
            // Optionally, allow login but restrict access or prompt for verification
            // For now, let's inform the user.
            // generateTokenAndSetCookie(user._id, res); // Could generate token to allow verification actions
            return res.status(403).json({ error: "Account not verified. Please verify your email.", action: "VERIFY_EMAIL" });
        }

        generateTokenAndSetCookie(user._id, res);
        user.lastLogin = new Date();
        await user.save({ validateBeforeSave: false }); // Save lastLogin without full validation

        const { password: pass, emailVerificationOTP: otp, passwordResetOTP: pOtp, ...rest } = user._doc;
        return res.status(200).json(rest);

    } catch (error) {
        res.status(500).json({ error: "Internal server error in login" });
        console.log(`Error occurred in the login controller: ${error.message}`);
    }
};

export const logout = async (req, res) => {
    try {
        res.clearCookie('jwt');
        return res.status(200).json({ message: "Successfully logged out" });
    } catch (error) {
        res.status(500).json({ error: "Internal server error in logout" });
        console.log(`Error occurred in the logout controller: ${error.message}`);
    }
};

export const getMe = async (req, res) => {
    try {
        // req.user is populated by protectRoute and already has password excluded
        const user = req.user;
        // Ensure other sensitive fields like OTPs are not sent
        const { emailVerificationOTP, passwordResetOTP, ...userData } = user.toObject(); // Use toObject() for clean manipulation
        return res.status(200).json(userData);
    } catch (error) {
        console.log("Error in the getMe controller", error.message);
        return res.status(500).json({ error: "Internal Server Error" });
    }
};

export const verifyEmail = async (req, res) => {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) {
            return res.status(400).json({ error: "Email and OTP are required." });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }

        if (user.isVerified) {
            return res.status(400).json({ error: "Email is already verified." });
        }

        if (!user.emailVerificationOTP || user.emailVerificationOTP.otp !== otp) {
            return res.status(400).json({ error: "Invalid OTP." });
        }

        if (new Date() > new Date(user.emailVerificationOTP.expiresAt)) {
            return res.status(400).json({ error: "OTP has expired." });
        }

        user.isVerified = true;
        user.emailVerificationOTP = { otp: null, expiresAt: null }; // Clear OTP
        await user.save({ validateBeforeSave: false });

        return res.status(200).json({ message: "Email verified successfully." });

    } catch (error) {
        console.log("Error in verifyEmail controller:", error.message);
        return res.status(500).json({ error: "Internal server error." });
    }
};

export const resendVerificationEmail = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ error: "Email is required." });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }

        if (user.isVerified) {
            return res.status(400).json({ error: "Email is already verified." });
        }

        const emailOtp = generateOTP();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // OTP valid for 10 minutes

        user.emailVerificationOTP = { otp: emailOtp, expiresAt: otpExpiry };
        await user.save({ validateBeforeSave: false });

        // await sendVerificationEmail(user.email, emailOtp); // Send verification email - Placeholder
        console.log(`Resent Verification OTP for ${user.email}: ${emailOtp}`); // Log OTP for dev

        return res.status(200).json({ message: "Verification email sent." });

    } catch (error) {
        console.log("Error in resendVerificationEmail controller:", error.message);
        return res.status(500).json({ error: "Internal server error." });
    }
};

export const requestPasswordReset = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ error: "Email is required." });
        }

        const user = await User.findOne({ email });
        if (!user) {
            // Don't reveal if user exists or not for security, but for dev it's fine
            return res.status(404).json({ error: "User with this email not found." });
        }

        const passwordOtp = generateOTP();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // OTP valid for 10 minutes

        user.passwordResetOTP = { otp: passwordOtp, expiresAt: otpExpiry };
        await user.save({ validateBeforeSave: false });

        // await sendPasswordResetEmail(user.email, passwordOtp); // Send password reset email - Placeholder
        console.log(`Password Reset OTP for ${user.email}: ${passwordOtp}`); // Log OTP for dev

        return res.status(200).json({ message: "Password reset OTP sent to your email." });

    } catch (error) {
        console.log("Error in requestPasswordReset controller:", error.message);
        return res.status(500).json({ error: "Internal server error." });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { email, otp, newPassword } = req.body;
        if (!email || !otp || !newPassword) {
            return res.status(400).json({ error: "Email, OTP, and new password are required." });
        }

        if (newPassword.length < 8) { // Match User model minlength
            return res.status(400).json({ error: "Password must be at least 8 characters long." });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: "User not found." });
        }

        if (!user.passwordResetOTP || user.passwordResetOTP.otp !== otp) {
            return res.status(400).json({ error: "Invalid OTP." });
        }

        if (new Date() > new Date(user.passwordResetOTP.expiresAt)) {
            return res.status(400).json({ error: "OTP has expired." });
        }

        user.password = newPassword; // Hashing will be done by pre-save hook
        user.passwordResetOTP = { otp: null, expiresAt: null }; // Clear OTP
        // Consider forcing re-login by clearing existing sessions if any
        // Forcing isVerified true here if they reset password, assuming they got the email for OTP
        // user.isVerified = true;
        await user.save(); // Full save to trigger password hashing and validation

        // Optionally, log the user out of all other sessions if needed
        // res.clearCookie('jwt'); // Clear current session cookie

        return res.status(200).json({ message: "Password reset successfully. Please login with your new password." });

    } catch (error) {
        console.log("Error in resetPassword controller:", error.message);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ error: error.message });
        }
        return res.status(500).json({ error: "Internal server error." });
    }
};