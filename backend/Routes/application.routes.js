import express from 'express';
import {
    createApplication,        // Renamed from applyForJob
    getMyApplications,        // Renamed from getApplicationsByUser
    getJobApplications,       // Renamed from getApplicationsByJob
    updateApplicationStatus,
    withdrawApplication,      // Renamed from deleteApplication (for job seeker action)
    getApplicationById        // New: Get a single application by its ID
} from '../Controllers/application.controller.js';
import { protectRoute } from '../middleware/protectRoute.js';
import { checkRole } from '../middleware/checkRole.js';

const router = express.Router();

// --- Job Seeker Routes ---
// POST /api/applications/job/:jobId - Apply for a job
router.post('/job/:jobId', protectRoute, checkRole('jobSeeker'), createApplication);

// GET /api/applications/my-applications - Get all applications submitted by the logged-in job seeker
router.get('/my-applications', protectRoute, checkRole('jobSeeker'), getMyApplications);

// PATCH /api/applications/:applicationId/withdraw - Withdraw an application
router.patch('/:applicationId/withdraw', protectRoute, checkRole('jobSeeker'), withdrawApplication);


// --- Employer/Admin Routes ---
// GET /api/applications/job/:jobId - Get all applications for a specific job
router.get('/job/:jobId/list', protectRoute, checkRole('employer', 'admin'), getJobApplications); // Added /list for clarity

// PATCH /api/applications/:applicationId/status - Update status of an application
router.patch('/:applicationId/status', protectRoute, checkRole('employer', 'admin'), updateApplicationStatus); // Changed from POST to PATCH


// --- Common/Shared Routes ---
// GET /api/applications/:applicationId - Get a single application by ID (for involved parties or admin)
router.get('/:applicationId', protectRoute, getApplicationById);


export default router;