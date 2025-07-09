import mongoose from "mongoose";

const applicationFieldSchema = new mongoose.Schema({
    fieldName: {
        type: String,
        required: [true, "Field name for application submission is required."]
    },
    fieldType: { // To know how to interpret the value, e.g., 'file', 'text'
        type: String,
        required: [true, "Field type for application submission is required."]
    },
    value: {
        type: mongoose.Schema.Types.Mixed, // Can be string, URL to file, number etc.
        required: [true, "Value for application field is required."]
    },
}, {_id: false});

const applicationSchema = new mongoose.Schema({
    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: [true, "Job ID is required for an application."]
    },  
    applicant: { // User (Job Seeker)
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "Applicant ID is required."]
    },
    employer: { // User (Employer who owns the job) - denormalized for easier querying by employer
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Employer ID is required."]
    },
    company: { // Company to which this job belongs - denormalized
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: [true, "Company ID is required."]
    },
    applicationFields: [applicationFieldSchema], // Stores responses to custom fields from Job's applicationRequirements
    status: {  
        type: String,  
        enum: ["submitted", "viewed", "shortlisted", "interviewing", "offered", "hired", "rejected", "withdrawn"],
        default: 'submitted',
        required: true
    },  
    // Optional: notes by employer or applicant regarding this application
    // notes: [{
    //     text: String,
    //     by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    //     createdAt: { type: Date, default: Date.now }
    // }]
}, { timestamps: true });

// Ensure an applicant can apply to a specific job only once
applicationSchema.index({ job: 1, applicant: 1 }, { unique: true });

// Pre-save hook to populate employer and company from the job
applicationSchema.pre('save', async function(next) {
    if (this.isNew || this.isModified('job')) {
        try {
            // Populate only necessary fields to avoid over-fetching
            const jobDoc = await mongoose.model('Job').findById(this.job).select('postedBy company').lean();
            if (jobDoc) {
                this.employer = jobDoc.postedBy;
                this.company = jobDoc.company;
            } else {
                // This error might be too late if job ID is invalid from the start.
                // Consider a check in the controller before creating the application instance.
                return next(new Error('Job not found for application. Cannot set employer and company.'));
            }
        } catch (error) {
            return next(error);
        }
    }
    next();
});

const Application = mongoose.model('Application', applicationSchema);
export default Application;