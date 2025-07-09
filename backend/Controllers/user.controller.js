import User from "../Models/user.model.js";
import bcrypt from "bcryptjs"; // Keep for password comparison if needed, though model handles hashing

export const getUserProfile = async (req, res) => {
    try {
        const { userId } = req.params; // Or req.user._id for '/me'
        const user = await User.findById(userId)
            .select("-password -emailVerificationOTP -passwordResetOTP") // Exclude sensitive fields
            .populate("company", "name logo") // If employer, populate basic company info
            .populate("savedJobs", "title companyName location employmentType"); // If job seeker

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Further privacy checks can be added here based on req.user and user.profileVisibility
        // For now, returning the fetched user profile
        res.status(200).json(user);

    } catch (error) {
        console.error("Error in getUserProfile:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};


export const updateUserProfile = async (req, res) => {
    const userId = req.user._id; // User can only update their own profile
    const {
        fullName, username, email, // Basic info
        currentPassword, newPassword, // Password change
        bio, location, phoneNumber, title, skills, // Common profile fields
        education, experience, certifications, // Job Seeker specific arrays
        resume, portfolioURL, profilePicture, // URLs
        profileVisibility, contactInfoVisibility, jobAlertsEnabled // Settings
    } = req.body;

    try {
        const user = await User.findById(userId).select("+password"); // Select password for currentPassword check
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Handle password change
        if (newPassword) {
            if (!currentPassword) {
                return res.status(400).json({ error: "Current password is required to set a new password." });
            }
            const isMatch = await user.comparePassword(currentPassword);
            if (!isMatch) {
                return res.status(400).json({ error: "Current password is incorrect." });
            }
            if (newPassword.length < 8) { // Match model validation
                return res.status(400).json({ error: "New password must be at least 8 characters long." });
            }
            user.password = newPassword; // Hashing handled by pre-save hook
        } else if (currentPassword) {
            return res.status(400).json({ error: "New password is required if current password is provided." });
        }

        // Update basic fields
        if (fullName) user.fullName = fullName;
        if (username) { // Check for username uniqueness if changed
            if (username !== user.username) {
                const existingUser = await User.findOne({ username });
                if (existingUser) {
                    return res.status(400).json({ error: "Username is already taken." });
                }
                user.username = username;
            }
        }
        if (email) { // Check for email uniqueness if changed, consider re-verification
            if (email !== user.email) {
                const existingEmail = await User.findOne({ email });
                if (existingEmail) {
                    return res.status(400).json({ error: "Email is already taken." });
                }
                user.email = email;
                // user.isVerified = false; // Optional: force re-verification for email change
                // const emailOtp = generateOTP(); // generate and send new OTP
                // user.emailVerificationOTP = { otp: emailOtp, expiresAt: new Date(Date.now() + 10 * 60 * 1000) };
                // console.log(`New verification OTP for ${user.email}: ${emailOtp}`);
            }
        }

        // Update other profile fields
        if (bio !== undefined) user.bio = bio;
        if (location !== undefined) user.location = location;
        if (phoneNumber !== undefined) user.phoneNumber = phoneNumber;
        if (profilePicture !== undefined) user.profilePicture = profilePicture;

        // Role-specific fields
        if (user.role === "jobSeeker") {
            if (title !== undefined) user.title = title;
            if (skills !== undefined) user.skills = skills; // Assumes skills is an array of strings
            if (education !== undefined) user.education = education; // Assumes education is an array of objects matching schema
            if (experience !== undefined) user.experience = experience; // Assumes experience is an array of objects
            if (certifications !== undefined) user.certifications = certifications; // Assumes certifications is an array of objects
            if (resume !== undefined) user.resume = resume;
            if (portfolioURL !== undefined) user.portfolioURL = portfolioURL;
        }

        // Update settings
        if (profileVisibility !== undefined) user.profileVisibility = profileVisibility;
        if (contactInfoVisibility !== undefined) user.contactInfoVisibility = contactInfoVisibility;
        if (jobAlertsEnabled !== undefined) user.jobAlertsEnabled = jobAlertsEnabled;


        const updatedUser = await user.save();

        // Exclude sensitive fields from response
        const { password: _, emailVerificationOTP: _otp, passwordResetOTP: _potp, ...rest } = updatedUser.toObject();

        return res.status(200).json(rest);

    } catch (error) {
        console.error("Error in updateUserProfile:", error.message);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ error: error.message });
        }
        // Handle duplicate key errors for username/email if race condition occurs despite checks
        if (error.code === 11000) {
            return res.status(400).json({ error: "Username or email already exists." });
        }
        res.status(500).json({ error: "Internal server error" });
    }
};