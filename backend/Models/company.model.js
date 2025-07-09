import mongoose from "mongoose";

const companySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Company name is required"],
        trim: true,
        unique: true,
    },
    description: {
        type: String,
        required: [true, "Company description is required"],
        maxlength: 2000,
    },
    logo: {
        type: String, // URL to company logo
    },
    website: {
        type: String,
        trim: true,
        // Basic URL validation, can be improved with a regex
        match: [/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/, 'Please fill a valid website URL']
    },
    industry: {
        type: String,
        trim: true,
    },
    companySize: {
        type: String, // E.g., "1-10 employees", "51-200 employees"
    },
    location: {
        type: String,
        trim: true,
    },
    contactEmail: {
        type: String,
        trim: true,
        lowercase: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please fill a valid email address'],
    },
    contactPhone: {
        type: String,
        trim: true,
    },
    foundedYear: {
        type: Number,
        min: [1000, 'Invalid year'], // Basic validation for year
        max: [new Date().getFullYear(), 'Invalid year, cannot be in the future']
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    admins: [{ // Users who can manage this company profile (besides createdBy)
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }],
    isVerified: {
        type: Boolean,
        default: false,
    },
    socialLinks: {
        linkedin: String,
        twitter: String,
        facebook: String,
        // Add more as needed
    },
    // Analytics can be added here or in a separate collection
    // totalJobsPosted: { type: Number, default: 0 },
    // totalHires: { type: Number, default: 0 },
    // averageRating: { type: Number, default: 0, min:0, max: 5 } // If reviews are implemented

}, { timestamps: true });

// Index for searching companies by name or industry with weights
companySchema.index(
    {
        name: 'text',
        industry: 'text',
        description: 'text' // Add description to search
    },
    {
        weights: {
            name: 10,
            industry: 5,
            description: 2
        },
        name: "CompanyTextIndex"
    }
);
companySchema.index({ location: 1 }); // For location-based filtering
companySchema.index({ createdAt: -1 });


const Company = mongoose.model("Company", companySchema);
export default Company;
