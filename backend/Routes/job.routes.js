import express from 'express';
import {
    createJob,      // Renamed from postJob
    getAllJobs,     // Kept, but logic will be updated for public access primarily
    getJobById,
    updateJob,
    deleteJob,
    getMyPostedJobs, // New specific route
    getCompanyJobs   // New specific route
    // jobStats      // Commented out in controller, so remove from here for now
} from '../Controllers/job.controller.js';
import { protectRoute } from '../middleware/protectRoute.js';
import { checkRole } from '../middleware/checkRole.js';

const router = express.Router();

// --- Public Routes ---
// GET /api/jobs - Get all open jobs with filters (replaces old /get-jobs but now public)
router.get('/', getAllJobs);

// GET /api/jobs/company/:companyId - Get all open jobs for a specific company
router.get('/company/:companyId', getCompanyJobs);

// GET /api/jobs/:jobId - Get a specific job by ID
router.get('/:jobId', getJobById);

// GET /api/jobs/:jobId/similar - Get similar jobs
router.get('/:jobId/similar', getSimilarJobs);


// --- Authenticated Routes (Employer or Admin) ---
// POST /api/jobs - Create a new job
router.post('/', protectRoute, checkRole('employer', 'admin'), createJob); // Changed from /post-job

// PUT /api/jobs/:jobId - Update a job
router.put('/:jobId', protectRoute, checkRole('employer', 'admin'), updateJob); // Changed from /update-job/:id and POST to PUT

// DELETE /api/jobs/:jobId - Delete a job
router.delete('/:jobId', protectRoute, checkRole('employer', 'admin'), deleteJob); // Changed from /delete-job/:id


// --- Employer Specific Routes ---
// GET /api/jobs/my-posted/list - Get jobs posted by the authenticated employer
router.get('/my-posted/list', protectRoute, checkRole('employer', 'admin'), getMyPostedJobs);


// --- Admin Specific Routes (if any beyond basic CRUD with role check) ---
// Example: router.patch('/:jobId/admin-status', protectRoute, checkRole('admin'), adminUpdateJobStatus);


// router.get('/job-stats', protectRoute, checkRole('employer'), jobStats); // jobStats functionality needs review

export default router;
