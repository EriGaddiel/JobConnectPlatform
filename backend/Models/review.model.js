import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    reviewType: {
        type: String,
        enum: ['job', 'candidate'],
        required: true,
    },
    jobId: { // The job being reviewed by a job seeker
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        // Conditional requirement: only if reviewType is 'job'
        required: function() { return this.reviewType === 'job'; } 
    },
    candidateId: { // The candidate (User) being reviewed by an employer
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        // Conditional requirement: only if reviewType is 'candidate'
        required: function() { return this.reviewType === 'candidate'; }
    },
    reviewerId: { // The user who wrote the review (job seeker for 'job' type, employer for 'candidate' type)
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // Stores the employer associated with this review.
    // - If reviewType is 'job', this is the employer who posted the job (job.createdBy).
    // - If reviewType is 'candidate', this is the employer who is rating the candidate (same as reviewerId).
    targetEmployerId: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true // This will be populated by controller logic based on reviewType
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        trim: true,
        maxLength: 2000 // Optional: set a max length for comments
    }
}, { timestamps: true });

// Indexes for common query patterns
reviewSchema.index({ jobId: 1, reviewType: 1 }); // For fetching all reviews of a job
reviewSchema.index({ candidateId: 1, reviewType: 1 }); // For fetching all reviews of a candidate
reviewSchema.index({ reviewerId: 1 }); // For fetching all reviews by a specific user
reviewSchema.index({ targetEmployerId: 1, reviewType: 1 }); // For fetching reviews related to an employer

// Note: Further validation logic (e.g., ensuring reviewer is not rating themselves,
// ensuring targetEmployerId is correctly populated based on reviewType)
// will be handled in the controller or service layer.

const Review = mongoose.model('Review', reviewSchema);

export default Review;
