import express from 'express';
import { protectRoute } from '../middleware/protectRoute.js';
import { checkRole } from '../middleware/checkRole.js';

// Placeholder for controller functions (to be implemented in the next step)
import {
    submitJobReview,
    submitCandidateReview,
    getJobReviews,
    getCandidateReviews,
    getUserReviewStats
} from '../Controllers/review.controller.js'; // Adjust path if necessary

const router = express.Router();

// @route   POST /api/reviews/job/:jobId
// @desc    Submit a review for a job
// @access  Private (Job Seeker)
router.post(
    '/job/:jobId',
    protectRoute, 
    // Potentially add middleware: checkUserType('jobSeeker') or specific canReviewJob(jobId)
    submitJobReview
);

// @route   POST /api/reviews/candidate/:candidateId
// @desc    Submit a review for a candidate (job seeker)
// @access  Private (Employer)
router.post(
    '/candidate/:candidateId',
    protectRoute,
    checkRole('employer'), // Only employers can rate candidates
    // Potentially add middleware: canReviewCandidate(candidateId, jobIdFromContext)
    submitCandidateReview 
);

// @route   GET /api/reviews/job/:jobId
// @desc    Get all reviews for a specific job
// @access  Private (Authenticated users)
router.get(
    '/job/:jobId',
    protectRoute,
    getJobReviews
);

// @route   GET /api/reviews/candidate/:candidateId
// @desc    Get all reviews for a specific candidate
// @access  Private (Authenticated users - perhaps only candidate themselves or involved employers?)
// For now, let's keep it general authenticated access. Details can be refined in controller.
router.get(
    '/candidate/:candidateId',
    protectRoute,
    getCandidateReviews
);

// @route   GET /api/reviews/user/:userId/stats
// @desc    Get aggregated review statistics for a user (as employer and/or candidate)
// @access  Private (Authenticated users)
router.get(
    '/user/:userId/stats',
    protectRoute,
    getUserReviewStats
);

export default router;
