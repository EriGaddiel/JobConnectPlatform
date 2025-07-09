import mongoose from "mongoose";

const applicationRequirementSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, enum: ["file", "text", "number", "textarea"], required: true },
    required: { type: Boolean, default: false },
}, {_id: false});

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Job title is required"],
        trim: true,
    },
    description: {
        type: String,
        required: [true, "Job description is required"],
    },
    company: { // Reference to Company model
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
        required: [true, "Company is required"],
    },
    companyName: { // Denormalized for search/display, populated from Company model
        type: String,
        required: true,
    },
    companyLogo: { // Denormalized
        type: String,
    },
    location: {
        type: String,
        trim: true,
        required: [true, "Job location is required"],
    },
    // locationCoordinates: { // For geospatial queries
    //     type: { type: String, enum: ['Point'], default: 'Point' },
    //     coordinates: { type: [Number], index: '2dsphere' } // [longitude, latitude]
    // },
    salary: { // User-facing string, e.g., "$50k - $70k" or "Competitive"
        type: String,
    },
    salaryMin: { // For filtering and range searches
        type: Number,
        min: 0,
    },
    salaryMax: {
        type: Number,
        min: 0,
    },
    currency: { // e.g., USD, EUR, INR
        type: String,
        uppercase: true,
        trim: true,
    },
    employmentType: {
        type: String,
        enum: ["Full-time", "Part-time", "Contract", "Freelance", "Internship", "Temporary"],
        required: [true, "Employment type is required"],
    },
    category: { // Formal/Informal as seen in frontend
        type: String,
        enum: ["Formal", "Informal", "Other"], // Reflecting frontend
        required: [true, "Job category is required"],
    },
    responsibilities: {
        type: [String],
        default: [],
    },
    requirements: { // List of skills/qualifications
        type: [String],
        default: [],
    },
    benefits: {
        type: [String],
        default: [],
    },
    applicationDeadline: {
        type: Date,
    },
    applicationInstructions: { // E.g., "Apply via our company portal: link..."
        type: String,
    },
    applicationRequirements: [applicationRequirementSchema],
    postedBy: { // User (Employer) who posted the job
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    status: {
        type: String,
        enum: ["open", "closed", "draft", "archived", "pendingApproval"], // Added more statuses
        default: "open",
    },
    tags: { // For additional categorization/keywords for search
        type: [String],
        default: []
    },
    views: {
        type: Number,
        default: 0,
    },
    experienceLevel: {
        type: String,
        enum: ["Entry-level", "Mid-level", "Senior-level", "Lead", "Manager", "Executive", "Intern"],
    },
    remotePolicy: {
        type: String,
        enum: ["On-site", "Remote", "Hybrid"],
        default: "On-site",
    },
    // Add a field for number of applications received
    applicationCount: {
        type: Number,
        default: 0,
    }
}, { timestamps: true });

// Index for searching with weights
jobSchema.index(
    {
        title: "text",
        companyName: "text",
        tags: "text",
        location: "text", // Location might be better as a specific filter but can be in text search
        description: "text",
        employmentType: "text", // Adding more fields to text search
        category: "text",
        experienceLevel: "text"
    }, 
    {
        weights: {
            title: 10,
            companyName: 7,
            tags: 6,
            location: 5, // Weighted lower if primary location filter is used
            employmentType: 4,
            category: 3,
            experienceLevel: 3,
            description: 1
        },
        name: "JobTextIndex" // Naming the index
    }
);
// Keep other indexes if needed, e.g., for specific filters not covered by text search or for sorting
jobSchema.index({ employmentType: 1 });
jobSchema.index({ category: 1 });
jobSchema.index({ location: 1 }); // For regex-based location filter if not using text search for it primarily
jobSchema.index({ company: 1 }); // For filtering by company ID
jobSchema.index({ createdAt: -1 }); // For default sorting

// Pre-save hook to populate companyName and companyLogo from the referenced Company model
jobSchema.pre('save', async function(next) {
    if (this.isModified('company') || this.isNew) {
        try {
            const companyDoc = await mongoose.model('Company').findById(this.company);
            if (companyDoc) {
                this.companyName = companyDoc.name;
                this.companyLogo = companyDoc.logo || ''; // Ensure logo is at least an empty string
            } else { // If companyDoc is not found for either new or existing job (on company field modification)
                return next(new Error(`Company with ID ${this.company} not found. Cannot save job.`));
            }
        } catch (error) {
            console.error("Error in Job pre-save hook while fetching company:", error); // Log specific error
            return next(error); // Propagate error
        }
    }
    // Basic validation for salary range
    if (this.salaryMin !== undefined && this.salaryMax !== undefined && this.salaryMin > this.salaryMax) {
        return next(new Error('salaryMin cannot be greater than salaryMax.'));
    }
    next();
});

const Job = mongoose.model('Job', jobSchema);
export default Job;