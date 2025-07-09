import Job from '../Models/job.model.js';
import Application from '../Models/application.model.js';
import User from '../Models/user.model.js';
import Company from '../Models/company.model.js';
import mongoose from 'mongoose';

// @desc    Get analytics for a specific job (for employer)
// @route   GET /api/analytics/employer/jobs/:jobId
// @access  Private (Employer who posted job, Admin)
export const getJobAnalyticsForEmployer = async (req, res) => {
    try {
        const { jobId } = req.params;
        const loggedInUserId = req.user._id;

        const job = await Job.findById(jobId).select('postedBy views applicationCount title');
        if (!job) {
            return res.status(404).json({ error: "Job not found." });
        }

        if (!job.postedBy.equals(loggedInUserId) && req.user.role !== 'admin') {
            return res.status(403).json({ error: "Not authorized to view analytics for this job." });
        }

        // Get application status distribution
        const applicationStatusDistribution = await Application.aggregate([
            { $match: { job: new mongoose.Types.ObjectId(jobId) } },
            { $group: { _id: '$status', count: { $sum: 1 } } },
            { $project: { _id: 0, status: '$_id', count: 1 } }
        ]);

        res.status(200).json({
            jobId: job._id,
            jobTitle: job.title,
            totalViews: job.views,
            totalApplications: job.applicationCount,
            applicationStatusDistribution
        });

    } catch (error) {
        console.error("Error in getJobAnalyticsForEmployer:", error.message, error.stack);
        res.status(500).json({ error: "Internal server error" });
    }
};


// @desc    Get overall dashboard analytics for an employer
// @route   GET /api/analytics/employer/dashboard
// @access  Private (Employer)
export const getEmployerDashboardAnalytics = async (req, res) => {
    try {
        const employerId = req.user._id;
        const employer = await User.findById(employerId).select('company');

        if (!employer || (req.user.role === 'employer' && !employer.company) ) {
            return res.status(400).json({ error: "Employer profile or company association not found." });
        }

        let companyId;
        if (req.user.role === 'admin' && req.query.companyIdForAdmin) { // Admin can query for a specific company
            companyId = req.query.companyIdForAdmin;
        } else if (req.user.role === 'employer') {
            companyId = employer.company;
        } else if (req.user.role === 'admin' && !req.query.companyIdForAdmin) {
            return res.status(400).json({ error: "Admin must specify companyIdForAdmin for employer dashboard analytics." });
        }


        const totalActiveJobs = await Job.countDocuments({ company: companyId, status: 'open' });
        const totalJobsEverPosted = await Job.countDocuments({ company: companyId });

        // Total applications for jobs belonging to this employer's company
        const totalApplicationsReceived = await Application.countDocuments({ company: companyId });

        // Applications received in the last 30 days for this company
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const recentApplicationsCount = await Application.countDocuments({
            company: companyId,
            createdAt: { $gte: thirtyDaysAgo }
        });

        // Could add more: distribution of job statuses, top performing jobs by applications etc.

        res.status(200).json({
            companyId,
            totalActiveJobs,
            totalJobsEverPosted,
            totalApplicationsReceived,
            applicationsLast30Days: recentApplicationsCount,
        });

    } catch (error) {
        console.error("Error in getEmployerDashboardAnalytics:", error.message, error.stack);
        res.status(500).json({ error: "Internal server error" });
    }
};


// @desc    Get platform-wide analytics for an admin
// @route   GET /api/analytics/admin/platform-summary
// @access  Private (Admin)
export const getPlatformAdminAnalytics = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const userRolesDistribution = await User.aggregate([
            { $group: { _id: '$role', count: { $sum: 1 } } },
            { $project: { _id: 0, role: '$_id', count: 1 } }
        ]);

        const totalJobs = await Job.countDocuments();
        const jobStatusDistribution = await Job.aggregate([
            { $group: { _id: '$status', count: { $sum: 1 } } },
            { $project: { _id: 0, status: '$_id', count: 1 } }
        ]);

        const totalOpenJobs = await Job.countDocuments({ status: 'open' });

        const totalCompanies = await Company.countDocuments();
        const verifiedCompanies = await Company.countDocuments({ isVerified: true });

        const totalApplications = await Application.countDocuments();
        const applicationStatusDistribution = await Application.aggregate([
            { $group: { _id: '$status', count: { $sum: 1 } } },
            { $project: { _id: 0, status: '$_id', count: 1 } }
        ]);

        // New users in last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const newUsersLast30Days = await User.countDocuments({ createdAt: { $gte: thirtyDaysAgo }});


        res.status(200).json({
            totalUsers,
            userRolesDistribution,
            totalJobs,
            jobStatusDistribution,
            totalOpenJobs,
            totalCompanies,
            verifiedCompanies,
            totalApplications,
            applicationStatusDistribution,
            newUsersLast30Days
        });

    } catch (error) {
        console.error("Error in getPlatformAdminAnalytics:", error.message, error.stack);
        res.status(500).json({ error: "Internal server error" });
    }
};
