import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const OTPSchema = new mongoose.Schema({
    otp: { type: String, default: null },
    expiresAt: { type: Date, default: null },
}, {_id: false});

const educationSchema = new mongoose.Schema({
    degree: { type: String, required: true },
    institution: { type: String, required: true },
    period: { type: String },
    description: String,
});

const experienceSchema = new mongoose.Schema({
    position: { type: String, required: true },
    company: { type: String, required: true },
    period: { type: String },
    description: String,
});

const certificationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    issuer: { type: String, required: true },
    date: String,
    credentialId: String,
    credentialURL: String,
});

const userSchema = new mongoose.Schema({ // Removed 'await' from here
    username: {
        type: String,
        required: [true, "Username is required"],
        unique: true,
        trim: true,
    },
    fullName: {
        type: String,
        required: [true, "Full name is required"],
        trim: true,
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please fill a valid email address'],
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [8, "Password must be at least 8 characters long"],
    },
    role: { // Changed from userType
        type: String,
        enum: ["jobSeeker", "employer", "admin"],
        required: [true, "User role is required"],
        default: "jobSeeker",
    },
    profilePicture: { // Renamed from profileImg
        type: String,
        default: "",
    },
    bio: {
        type: String,
        maxlength: 500,
    },
    location: {
        type: String,
        trim: true,
    },
    phoneNumber: {
        type: String,
        trim: true,
    },
    title: { // Professional title for JobSeeker
        type: String,
        trim: true,
    },
    skills: {
        type: [String],
        default: [],
    },
    education: [educationSchema],
    experience: [experienceSchema],
    certifications: [certificationSchema],
    resume: { // URL to the resume file for JobSeeker
        type: String,
    },
    portfolioURL: { // For JobSeeker
        type: String,
        trim: true,
    },
    savedJobs: [{ // For JobSeeker
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job",
    }],
    company: { // For Employer role
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    isVerified: { // For email verification
        type: Boolean,
        default: false,
    },
    emailVerificationOTP: OTPSchema,
    passwordResetOTP: OTPSchema,
    lastLogin: Date,
    profileVisibility: {
        type: String,
        enum: ["public", "privateToEmployers", "private"],
        default: "public",
    },
    contactInfoVisibility: {
        type: String,
        enum: ["public", "connections", "private"],
        default: "connections",
    },
    jobAlertsEnabled: {
        type: Boolean,
        default: true,
    }
}, { timestamps: true });

// Pre-save hook to hash password
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    try {
        const salt = await bcrypt.genSalt(12);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;