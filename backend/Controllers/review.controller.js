import mongoose from 'mongoose';
import Review from '../Models/review.model.js';
import User from '../Models/user.model.js';
import Job from '../Models/job.model.js';

// Helper function to update user's average rating
const updateUserRating = async (userId, newRating, ratingType) => {
    const user = await User.findById(userId);
    if (!user) return; // Should not happen if IDs are correct

    let oldAverage, oldCount, updatePayload;

    if (ratingType === 'candidate') {
        oldAverage = user.averageRatingAsCandidate || 0;
        oldCount = user.numberOfCandidateRatings || 0;
        const newSum = (oldAverage * oldCount) + newRating;
        user.numberOfCandidateRatings = oldCount + 1;
        user.averageRatingAsCandidate = newSum / user.numberOfCandidateRatings;
    } else if (ratingType === 'employer') {
        oldAverage = user.averageRatingAsEmployer || 0;
        oldCount = user.numberOfEmployerRatings || 0;
        const newSum = (oldAverage * oldCount) + newRating;
        user.numberOfEmployerRatings = oldCount + 1;
        user.averageRatingAsEmployer = newSum / user.numberOfEmployerRatings;
    }
    await user.save();
};


export const submitJobReview = async (req, res) => {
    try {
        const { jobId } = req.params;
        const reviewerId = req.user.id; // from protectRoute
        const { rating, comment } = req.body;

        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({ message: 'Rating must be between 1 and 5.' });
        }

        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ message: 'Job not found.' });
        }

        const targetEmployerId = job.createdBy;

        if (reviewerId.toString() === targetEmployerId.toString()) {
            return res.status(403).json({ message: 'Employers cannot review their own job postings.' });
        }
        
        // Check if user already reviewed this job
        const existingReview = await Review.findOne({ reviewType: 'job', jobId, reviewerId });
        if (existingReview) {
            return res.status(400).json({ message: 'You have already reviewed this job.' });
        }

        const review = new Review({
            reviewType: 'job',
            jobId,
            reviewerId,
            targetEmployerId, // This is the employer who posted the job
            rating: Number(rating),
            comment
        });
        await review.save();

        // Update employer's average rating
        await updateUserRating(targetEmployerId, Number(rating), 'employer');
        
        // Optionally, update job's average rating if Job model has such fields

        res.status(201).json({ message: 'Job review submitted successfully.', review });

    } catch (error) {
        console.error('Error in submitJobReview:', error);
        res.status(500).json({ message: 'Server error while submitting job review.' });
    }
};

export const submitCandidateReview = async (req, res) => {
    try {
        const { candidateId } = req.params; // This is the ID of the user being reviewed (job seeker)
        const reviewerId = req.user.id; // This is the employer writing the review
        const { rating, comment, jobId: contextualJobId } = req.body; // contextualJobId for which job this review might be related

        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({ message: 'Rating must be between 1 and 5.' });
        }

        const candidate = await User.findById(candidateId);
        if (!candidate || candidate.userType !== 'jobSeeker') {
            return res.status(404).json({ message: 'Candidate (job seeker) not found.' });
        }

        if (reviewerId.toString() === candidateId.toString()) {
            return res.status(403).json({ message: 'Users cannot review themselves.' });
        }
        
        // Optional: Check if employer already reviewed this candidate (perhaps for a specific job context)
        // For simplicity, this example allows multiple reviews from an employer to a candidate,
        // but you might want to restrict this based on contextualJobId or other criteria.
        // const existingReview = await Review.findOne({ reviewType: 'candidate', candidateId, reviewerId, /* contextualJobId */ });
        // if (existingReview) {
        //     return res.status(400).json({ message: 'You have already reviewed this candidate for this context.' });
        // }

        // Ensure contextualJobId, if provided, belongs to the reviewing employer
        if (contextualJobId) {
            const job = await Job.findById(contextualJobId);
            if (!job || job.createdBy.toString() !== reviewerId.toString()) {
                return res.status(403).json({ message: 'Invalid job context or job does not belong to you.' });
            }
        }

        const review = new Review({
            reviewType: 'candidate',
            candidateId,
            reviewerId, // Employer writing the review
            targetEmployerId: reviewerId, // Employer associated with the review is the reviewer themselves
            rating: Number(rating),
            comment,
            // You could add contextualJobId to the review model if you want to store it persistently
        });
        await review.save();

        // Update candidate's average rating
        await updateUserRating(candidateId, Number(rating), 'candidate');

        res.status(201).json({ message: 'Candidate review submitted successfully.', review });

    } catch (error) {
        console.error('Error in submitCandidateReview:', error);
        res.status(500).json({ message: 'Server error while submitting candidate review.' });
    }
};

export const getJobReviews = async (req, res) => {
    try {
        const { jobId } = req.params;
        const reviews = await Review.find({ reviewType: 'job', jobId })
            .populate('reviewerId', 'fullName username profileImg') // Populate with job seeker's info
            .sort({ createdAt: -1 });
        
        if (!reviews) {
            return res.status(404).json({ message: 'No reviews found for this job.' });
        }
        res.status(200).json(reviews);
    } catch (error) {
        console.error('Error in getJobReviews:', error);
        res.status(500).json({ message: 'Server error while fetching job reviews.' });
    }
};

export const getCandidateReviews = async (req, res) => {
    try {
        const { candidateId } = req.params;
        const reviews = await Review.find({ reviewType: 'candidate', candidateId })
            .populate('reviewerId', 'fullName username profileImg') // Populate with employer's info
            .sort({ createdAt: -1 });

        if (!reviews) {
            return res.status(404).json({ message: 'No reviews found for this candidate.' });
        }
        res.status(200).json(reviews);
    } catch (error) {
        console.error('Error in getCandidateReviews:', error);
        res.status(500).json({ message: 'Server error while fetching candidate reviews.' });
    }
};

export const getUserReviewStats = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId)
            .select('averageRatingAsCandidate numberOfCandidateRatings averageRatingAsEmployer numberOfEmployerRatings fullName username userType');

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        res.status(200).json(user);
    } catch (error) {
        console.error('Error in getUserReviewStats:', error);
        res.status(500).json({ message: 'Server error while fetching user review stats.' });
    }
};
