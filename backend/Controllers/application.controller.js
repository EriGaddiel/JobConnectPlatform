import Application from '../Models/application.model.js';
import Job from '../Models/job.model.js';
import User from '../Models/user.model.js';
import Notification from '../Models/notification.model.js';
import { io, userSocketMap } from '../server.js'; // Import Socket.IO instance and user map

// @desc    Apply for a job (Create a new application)
// @route   POST /api/applications/job/:jobId
// @access  Private (JobSeeker)
export const createApplication = async (req, res) => {
    const { jobId } = req.params;
    const applicantId = req.user._id; // from protectRoute
    const { applicationFields } = req.body; // Expecting an array of {fieldName, fieldType, value}

    try {
        const job = await Job.findById(jobId).select("postedBy company applicationRequirements title");
        if (!job) {
            return res.status(404).json({ error: "Job not found." });
        }
        if (job.status !== 'open') {
            return res.status(400).json({ error: "This job is no longer open for applications." });
        }

        // Basic validation: Check if required fields specified in job.applicationRequirements are present
        // More robust validation can be added here (e.g., file type checks if 'file' fieldType)
        if (job.applicationRequirements && job.applicationRequirements.length > 0) {
            for (const reqField of job.applicationRequirements) {
                if (reqField.required) {
                    const submittedField = applicationFields.find(f => f.fieldName === reqField.name);
                    if (!submittedField || submittedField.value === undefined || submittedField.value === '') {
                        return res.status(400).json({ error: `Required field '${reqField.name}' is missing.` });
                    }
                }
            }
        }

        const newApplication = new Application({
            job: jobId,
            applicant: applicantId,
            applicationFields,
            // employer and company will be populated by pre-save hook in Application model
        });

        const savedApplication = await newApplication.save();

        // Increment applicationCount on the Job model
        await Job.findByIdAndUpdate(jobId, { $inc: { applicationCount: 1 } });


        // --- Real-time Notification Logic ---
        const employerId = job.postedBy.toString();
        const applicantUser = await User.findById(applicantId).select("fullName username").lean();

        const notificationMessage = `${applicantUser.fullName || applicantUser.username} applied for your job: ${job.title}.`;

        // 1. Save notification to database
        const notification = new Notification({
            recipient: employerId,
            sender: applicantId,
            type: 'new_job_application',
            message: notificationMessage,
            link: `/dashboard/employer/applications/job/${jobId}`, // Example link
            entityId: savedApplication._id,
            entityType: 'Application'
        });
        await notification.save();

        // 2. Emit real-time event if employer is connected
        const employerSocketId = userSocketMap[employerId];
        if (employerSocketId) {
            io.to(employerSocketId).emit('newNotification', {
                _id: notification._id, // Send notification ID so client can mark as read etc.
                message: notificationMessage,
                link: notification.link,
                type: notification.type,
                createdAt: notification.createdAt,
                // Include sender details if needed by frontend immediately
                sender: { _id: applicantUser._id, fullName: applicantUser.fullName, username: applicantUser.username }
            });
             io.to(employerSocketId).emit('newApplicationReceived', { // More specific event for application list refresh
                application: savedApplication, // Or just key details
                jobTitle: job.title,
                applicantName: applicantUser.fullName || applicantUser.username
            });
        }
        console.log(`Notification created for employer ${employerId}. Socket ID: ${employerSocketId || 'not connected'}`);
        // --- End Real-time Notification Logic ---


        // Populate fields for the response
        const populatedApplication = await Application.findById(savedApplication._id)
            .populate('applicant', 'fullName username profilePicture')
            .populate('job', 'title companyName')
            .lean();

        res.status(201).json({ message: "Application submitted successfully.", application: populatedApplication });

    } catch (error) {
        console.error("Error applying for job:", error.message, error.stack);
        if (error.code === 11000) { // Duplicate key error (user already applied for this job)
            return res.status(400).json({ error: "You have already applied for this job." });
        }
        if (error.name === 'ValidationError') {
            return res.status(400).json({ error: error.message });
        }
        res.status(500).json({ error: "Internal server error" });
    }
};


// @desc    Get applications submitted by the authenticated job seeker
// @route   GET /api/applications/my-applications
// @access  Private (JobSeeker)
export const getMyApplications = async (req, res) => {
    try {
        const applicantId = req.user._id;
        const { status, page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

        const query = { applicant: applicantId };
        if (status) query.status = status;

        const sortOptions = {};
        sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

        const applications = await Application.find(query)
            .populate('job', 'title companyName location employmentType companyLogo')
            .populate('company', 'name logo') // Populate company directly from application for consistency
            .sort(sortOptions)
            .skip((parseInt(page) - 1) * parseInt(limit))
            .limit(parseInt(limit))
            .lean();

        const totalApplications = await Application.countDocuments(query);

        res.status(200).json({
            applications,
            currentPage: parseInt(page),
            totalPages: Math.ceil(totalApplications / parseInt(limit)),
            totalApplications
        });
    } catch (error) {
        console.error("Error fetching user's applications:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

// @desc    Get applications for a specific job (for employer)
// @route   GET /api/applications/job/:jobId
// @access  Private (Employer who posted the job, Admin)
export const getJobApplications = async (req, res) => {
    const { jobId } = req.params;
    const loggedInUserId = req.user._id;

    try {
        const job = await Job.findById(jobId).select("postedBy");
        if (!job) {
            return res.status(404).json({ error: "Job not found." });
        }

        // Authorization: Only job poster or admin can view applications
        if (!job.postedBy.equals(loggedInUserId) && req.user.role !== 'admin') {
            return res.status(403).json({ error: "Not authorized to view applications for this job." });
        }

        const { status, page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
        const query = { job: jobId };
        if (status) query.status = status;

        const sortOptions = {};
        sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

        const applications = await Application.find(query)
            .populate('applicant', 'fullName username email profilePicture title skills location') // Populate applicant details
            .sort(sortOptions)
            .skip((parseInt(page) - 1) * parseInt(limit))
            .limit(parseInt(limit))
            .lean();

        const totalApplications = await Application.countDocuments(query);

        res.status(200).json({
            applications,
            currentPage: parseInt(page),
            totalPages: Math.ceil(totalApplications / parseInt(limit)),
            totalApplications
        });
    } catch (error) {
        console.error("Error fetching job applications:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

// @desc    Update application status (by employer or admin)
// @route   PATCH /api/applications/:applicationId/status
// @access  Private (Employer of the job, Admin)
export const updateApplicationStatus = async (req, res) => {
    const { applicationId } = req.params;
    const { status } = req.body;
    const loggedInUserId = req.user._id;

    if (!status) {
        return res.status(400).json({ error: "Status is required." });
    }
    // Validate status against enum values in model
    if (!Application.schema.path('status').enumValues.includes(status)) {
        return res.status(400).json({ error: "Invalid status value." });
    }

    try {
        const application = await Application.findById(applicationId).populate('job', 'postedBy title');
        if (!application) {
            return res.status(404).json({ error: "Application not found." });
        }

        // Authorization: Employer who posted the job or Admin
        if (!application.job.postedBy.equals(loggedInUserId) && req.user.role !== 'admin') {
            return res.status(403).json({ error: "Not authorized to update this application's status." });
        }

        application.status = status;
        const updatedApplication = await application.save();

        // --- Real-time Notification for Job Seeker ---
        const applicantId = application.applicant.toString();
        const jobSeekerSocketId = userSocketMap[applicantId];
        const notificationMessage = `The status of your application for "${application.job.title}" has been updated to: ${status}.`;

        const notification = new Notification({
            recipient: applicantId,
            sender: loggedInUserId, // The employer/admin who updated it
            type: 'application_status_update',
            message: notificationMessage,
            link: `/dashboard/my-applications`, // Example link
            entityId: application._id,
            entityType: 'Application'
        });
        await notification.save();

        if (jobSeekerSocketId) {
            io.to(jobSeekerSocketId).emit('newNotification', {
                _id: notification._id,
                message: notificationMessage,
                link: notification.link,
                type: notification.type,
                createdAt: notification.createdAt
            });
            io.to(jobSeekerSocketId).emit('applicationStatusChanged', {
                applicationId: application._id,
                newStatus: status,
                jobTitle: application.job.title
            });
        }
        console.log(`Notification sent to applicant ${applicantId} about status change. Socket ID: ${jobSeekerSocketId || 'not connected'}`);
        // --- End Real-time Notification ---


        res.status(200).json({ message: "Application status updated.", application: updatedApplication });
    } catch (error) {
        console.error("Error updating application status:", error.message);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ error: error.message });
        }
        res.status(500).json({ error: "Internal server error" });
    }
};

// @desc    Withdraw an application (by job seeker)
// @route   PATCH /api/applications/:applicationId/withdraw
// @access  Private (JobSeeker who owns the application)
export const withdrawApplication = async (req, res) => {
    const { applicationId } = req.params;
    const applicantId = req.user._id;

    try {
        const application = await Application.findById(applicationId);
        if (!application) {
            return res.status(404).json({ error: "Application not found." });
        }

        if (!application.applicant.equals(applicantId)) {
            return res.status(403).json({ error: "Not authorized to withdraw this application." });
        }

        // Check if application can be withdrawn (e.g., not already hired/rejected beyond a point)
        if (['hired', 'rejected'].includes(application.status)) {
             return res.status(400).json({ error: `Cannot withdraw application with status: ${application.status}.` });
        }

        application.status = 'withdrawn';
        const updatedApplication = await application.save();

        // Optionally notify employer (less critical than new app or status change by employer)

        res.status(200).json({ message: "Application withdrawn successfully.", application: updatedApplication });
    } catch (error) {
        console.error("Error withdrawing application:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

// @desc    Get a single application by ID (for involved parties or admin)
// @route   GET /api/applications/:applicationId
// @access  Private
export const getApplicationById = async (req, res) => {
    const { applicationId } = req.params;
    const loggedInUserId = req.user._id;

    try {
        const application = await Application.findById(applicationId)
            .populate('applicant', 'fullName username email profilePicture title skills location')
            .populate('job', 'title companyName location employmentType postedBy')
            .populate('company', 'name logo')
            .lean();

        if (!application) {
            return res.status(404).json({ error: "Application not found." });
        }

        // Authorization: Applicant, Employer of the job, or Admin
        const isApplicant = application.applicant._id.equals(loggedInUserId);
        const isEmployerOfJob = application.job.postedBy.equals(loggedInUserId);

        if (!isApplicant && !isEmployerOfJob && req.user.role !== 'admin') {
            return res.status(403).json({ error: "Not authorized to view this application." });
        }

        res.status(200).json(application);

    } catch (error) {
        console.error("Error fetching application by ID:", error.message);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ error: "Application not found (invalid ID format)" });
        }
        res.status(500).json({ error: "Internal server error" });
    }
};