import express from 'express';
import {
    getJobAnalyticsForEmployer,
    getEmployerDashboardAnalytics,
    getPlatformAdminAnalytics
} from '../Controllers/analytics.controller.js';
import { protectRoute } from '../middleware/protectRoute.js';
import { checkRole } from '../middleware/checkRole.js';

const router = express.Router();

// --- Employer Analytics Routes ---
// GET /api/analytics/employer/jobs/:jobId - Analytics for a specific job
router.get(
    '/employer/jobs/:jobId',
    protectRoute,
    checkRole('employer', 'admin'), // Employer (owner) or Admin can view
    getJobAnalyticsForEmployer
);

// GET /api/analytics/employer/dashboard - Overall dashboard stats for an employer
router.get(
    '/employer/dashboard',
    protectRoute,
    checkRole('employer', 'admin'), // Employer or Admin (if companyIdForAdmin provided)
    getEmployerDashboardAnalytics
);


// --- Admin Analytics Routes ---
// GET /api/analytics/admin/platform-summary - Platform-wide summary for admin
router.get(
    '/admin/platform-summary',
    protectRoute,
    checkRole('admin'),
    getPlatformAdminAnalytics
);

// More admin analytics routes can be added here, e.g.:
// router.get('/admin/job-trends', protectRoute, checkRole('admin'), getJobTrends);
// router.get('/admin/user-activity', protectRoute, checkRole('admin'), getUserActivity);

export default router;
