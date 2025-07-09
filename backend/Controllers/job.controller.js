import Job from "../Models/job.model.js";
import Company from "../Models/company.model.js";
import User from "../Models/user.model.js";
import Application from "../Models/application.model.js"; // For deleting applications when a job is deleted

// @desc    Create a new job posting
// @route   POST /api/jobs
// @access  Private (Employer, Admin)
export const createJob = async (req, res) => {
    try {
        const loggedInUser = await User.findById(req.user._id);

        if (!loggedInUser.company && loggedInUser.role === 'employer') {
            return res.status(400).json({ error: "You must be associated with a company to post a job. Please update your profile or create a company profile." });
        }

        // If admin is creating a job, they must specify the companyId in the request body
        let companyIdToPostUnder;
        if (loggedInUser.role === 'admin') {
            if (!req.body.companyIdForAdmin) { // Expect companyIdForAdmin if admin is posting
                return res.status(400).json({ error: "Admin must specify a companyIdForAdmin to post a job for." });
            }
            companyIdToPostUnder = req.body.companyIdForAdmin;
        } else { // Employer posts under their own company
            companyIdToPostUnder = loggedInUser.company;
        }

        const companyExists = await Company.findById(companyIdToPostUnder);
        if (!companyExists) {
             return res.status(400).json({ error: `Company with ID ${companyIdToPostUnder} not found.` });
        }
        // Optionally, check if companyExists.isVerified in production

        const {
            title, description, location, salary, salaryMin, salaryMax, currency,
            employmentType, category, responsibilities, requirements, benefits,
            applicationDeadline, applicationInstructions, applicationRequirements,
            experienceLevel, remotePolicy, tags, status = "open"
        } = req.body;

        if (!title || !description || !location || !employmentType || !category) {
            return res.status(400).json({ error: "Required fields are missing (title, description, location, employmentType, category)." });
        }

        if (salaryMin !== undefined && salaryMax !== undefined && parseFloat(salaryMin) > parseFloat(salaryMax)) {
            return res.status(400).json({ error: "Salary minimum cannot be greater than salary maximum." });
        }

        const newJob = new Job({
            title, description, location, salary, salaryMin, salaryMax, currency,
            employmentType, category, responsibilities, requirements, benefits,
            applicationDeadline, applicationInstructions, applicationRequirements,
            experienceLevel, remotePolicy, tags, status,
            company: companyIdToPostUnder,
            postedBy: req.user._id, // The logged-in user who is performing the action
        });

        const savedJob = await newJob.save(); // Pre-save hook will populate companyName, companyLogo
        res.status(201).json(savedJob);

    } catch (error) {
        console.error("Error creating job:", error.message, error.stack);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ error: error.message });
        }
        res.status(500).json({ error: "Internal server error" });
    }
};

// @desc    Get all job postings (public, with filters)
// @route   GET /api/jobs
// @access  Public
export const getAllJobs = async (req, res) => {
    try {
        const {
            search, location: locFilter, type, category: catFilter, salaryMin: sMin, salaryMax: sMax,
            postedDate, companyId, experienceLevel: expLevel, remotePolicy: remPol,
            sortBy = 'createdAt', sortOrder = 'desc', page = 1, limit = 10
        } = req.query;

        const query = { status: 'open' }; // Default to open jobs for public view

        if (search) {
            query.$text = { $search: search };
        }
        if (locFilter) {
            query.location = { $regex: locFilter, $options: 'i' };
        }
        if (type) {
            query.employmentType = Array.isArray(type) ? { $in: type } : type;
        }
        if (catFilter) {
            query.category = Array.isArray(catFilter) ? { $in: catFilter } : catFilter;
        }
        if (sMin) {
            query.salaryMin = { $gte: parseFloat(sMin) };
        }
        if (sMax && parseFloat(sMax) > 0) { // Only apply if sMax is a positive number
             query.salaryMax = { $lte: parseFloat(sMax) };
             if(query.salaryMin && parseFloat(sMax) < query.salaryMin.$gte) { // if sMax is less than sMin
                // remove salaryMin or adjust query logic, for now just ignore sMax if it makes range invalid
             }
        } else if (sMax === "0" || sMax === 0) { // Handle cases where users might want to see jobs up to 0 (e.g. volunteer)
            query.salaryMax = { $lte: 0 };
        }


        if (companyId) {
            query.company = companyId;
        }
        if (expLevel) {
            query.experienceLevel = Array.isArray(expLevel) ? { $in: expLevel } : expLevel;
        }
        if (remPol) {
            query.remotePolicy = Array.isArray(remPol) ? { $in: remPol } : remPol;
        }
        if (postedDate) {
            let dateFilter;
            const now = new Date();
            if (postedDate.endsWith('d')) {
                const days = parseInt(postedDate.slice(0, -1));
                dateFilter = new Date(new Date().setDate(now.getDate() - days));
            } else if (postedDate.endsWith('h')) {
                const hours = parseInt(postedDate.slice(0, -1));
                dateFilter = new Date(new Date().setHours(now.getHours() - hours));
            }
            if (dateFilter) query.createdAt = { $gte: dateFilter };
        }

        const sortOptions = {};
        let projection = {};

        if (search) {
            // If there's a search query, sort by text score, then by other criteria
            sortOptions.score = { $meta: "textScore" };
            projection.score = { $meta: "textScore" }; // Include score in results for debugging/potential use
            // Add secondary sort if needed, e.g., sort by score then by date
            if (sortBy && sortBy !== 'score') { // Avoid adding score twice if sortBy is 'score'
                sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;
            } else if (!sortBy) { // Default secondary sort if only search term is provided
                 sortOptions['createdAt'] = -1;
            }
        } else if (sortBy && sortOrder) {
            sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;
        } else {
            sortOptions['createdAt'] = -1; // Default sort if no search and no specific sort
        }


        const countQuery = { ...query };

        const jobs = await Job.find(query, projection) // Add projection here
            .populate('company', 'name logo industry')
            .sort(sortOptions)
            .skip((parseInt(page) - 1) * parseInt(limit))
            .limit(parseInt(limit));

        const totalJobs = await Job.countDocuments(countQuery);

        res.status(200).json({
            jobs,
            currentPage: parseInt(page),
            totalPages: Math.ceil(totalJobs / parseInt(limit)),
            totalJobs
        });

    } catch (error) {
        console.error("Error fetching all jobs:", error.message, error.stack);
        res.status(500).json({ error: "Internal server error" });
    }
};

// @desc    Get a single job by ID
// @route   GET /api/jobs/:jobId
// @access  Public (with some status restrictions)
export const getJobById = async (req, res) => {
    try {
        const { jobId } = req.params;
        const job = await Job.findById(jobId)
                             .populate('company', 'name logo description website industry companySize location isVerified')
                             .populate('postedBy', 'fullName profilePicture');

        if (!job) {
            return res.status(404).json({ error: "Job not found." });
        }

        // For public users, only show 'open' jobs. Owner/Admin might see others.
        if (job.status !== 'open') {
            if (!req.user || (!job.postedBy.equals(req.user._id) && req.user.role !== 'admin')) {
                 return res.status(404).json({ error: "Job not found or not available." });
            }
        }

        if (job.status === 'open' && (!req.user || !job.postedBy.equals(req.user._id))) { // Increment views only for public views by non-owners
            job.views = (job.views || 0) + 1;
            await job.save({ validateBeforeSave: false }); // Avoid running all validations for a view increment
        }

        res.status(200).json(job);
    } catch (error) {
        console.error("Error fetching job by ID:", error.message, error.stack);
        if (error.kind === 'ObjectId') {
            return res.status(404).json({ error: "Job not found (invalid ID format)" });
        }
        res.status(500).json({ error: "Internal server error" });
    }
};

// @desc    Update a job posting
// @route   PUT /api/jobs/:jobId
// @access  Private (Employer who posted, or Admin)
export const updateJob = async (req, res) => {
    try {
        const { jobId } = req.params;
        const userId = req.user._id;

        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ error: "Job not found." });
        }

        if (!job.postedBy.equals(userId) && req.user.role !== 'admin') {
            return res.status(403).json({ error: "Not authorized to update this job." });
        }

        const {
            title, description, location, salary, salaryMin, salaryMax, currency,
            employmentType, category, responsibilities, requirements, benefits,
            applicationDeadline, applicationInstructions, applicationRequirements,
            experienceLevel, remotePolicy, tags, status, companyIdForAdmin // companyIdForAdmin for admin to change company
        } = req.body;

        // Update fields selectively
        if (title !== undefined) job.title = title;
        if (description !== undefined) job.description = description;
        // ... (update other fields similarly) ...
        const fieldsToUpdate = { title, description, location, salary, salaryMin, salaryMax, currency, employmentType, category, responsibilities, requirements, benefits, applicationDeadline, applicationInstructions, applicationRequirements, experienceLevel, remotePolicy, tags, status};
        for (const key in fieldsToUpdate) {
            if (fieldsToUpdate[key] !== undefined) {
                job[key] = fieldsToUpdate[key];
            }
        }

        if (req.user.role === 'admin' && companyIdForAdmin && job.company.toString() !== companyIdForAdmin) {
            const companyExists = await Company.findById(companyIdForAdmin);
            if (!companyExists) {
                return res.status(400).json({ error: "Invalid company ID provided by admin." });
            }
            job.company = companyIdForAdmin; // Pre-save hook will update companyName, companyLogo
        } else if (companyIdForAdmin && req.user.role !== 'admin') {
             return res.status(403).json({error: "Only admins can change the company of a job."})
        }

        if ((job.salaryMin !== undefined && job.salaryMax !== undefined) && parseFloat(job.salaryMin) > parseFloat(job.salaryMax)) {
            return res.status(400).json({ error: "Salary minimum cannot be greater than salary maximum." });
        }

        const updatedJob = await job.save();
        res.status(200).json(updatedJob);

    } catch (error) {
        console.error("Error updating job:", error.message, error.stack);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ error: error.message });
        }
        res.status(500).json({ error: "Internal server error" });
    }
};

// @desc    Delete a job posting
// @route   DELETE /api/jobs/:jobId
// @access  Private (Employer who posted, or Admin)
export const deleteJob = async (req, res) => {
    try {
        const { jobId } = req.params;
        const userId = req.user._id;

        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ error: "Job not found." });
        }

        if (!job.postedBy.equals(userId) && req.user.role !== 'admin') {
            return res.status(403).json({ error: "Not authorized to delete this job." });
        }

        // Delete associated applications first
        await Application.deleteMany({ job: jobId });
        // Remove from users' saved jobs (optional, or handle gracefully on frontend)
        await User.updateMany({}, { $pull: { savedJobs: jobId } });

        await job.deleteOne();
        res.status(200).json({ message: "Job and associated applications deleted successfully." });

    } catch (error) {
        console.error("Error deleting job:", error.message, error.stack);
        res.status(500).json({ error: "Internal server error" });
    }
};

// @desc    Get jobs posted by the authenticated employer
// @route   GET /api/jobs/my-jobs
// @access  Private (Employer, Admin can also use if they have a company linked for some reason)
export const getMyPostedJobs = async (req, res) => {
    try {
        const employerId = req.user._id;
        const employer = await User.findById(employerId);

        if (!employer.company && req.user.role === 'employer') {
             return res.status(400).json({ error: "You are not associated with any company to have posted jobs." });
        }
        // If admin, they might not have a company themselves, so this route might be less relevant for admins
        // unless they are querying jobs they posted AS an employer (if roles can be fluid or admin posts for a default company)

        const { status, page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

        const query = { postedBy: employerId }; // Jobs posted by this user
        if (status) {
            query.status = Array.isArray(status) ? { $in: status } : status;
        }


        const sortOptions = {};
        sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

        const jobs = await Job.find(query)
            .populate('company', 'name logo')
            .sort(sortOptions)
            .skip((parseInt(page) - 1) * parseInt(limit))
            .limit(parseInt(limit));

        const totalJobs = await Job.countDocuments(query);

        res.status(200).json({
            jobs,
            currentPage: parseInt(page),
            totalPages: Math.ceil(totalJobs / parseInt(limit)),
            totalJobs
        });
    } catch (error) {
        console.error("Error fetching employer's posted jobs:", error.message, error.stack);
        res.status(500).json({ error: "Internal server error" });
    }
};

// @desc    Get jobs posted by a specific company (public)
// @route   GET /api/jobs/company/:companyId
// @access  Public
export const getCompanyJobs = async (req, res) => {
    try {
        const { companyId } = req.params;
        const { status = 'open', page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;

        const companyExists = await Company.findById(companyId);
        if (!companyExists) {
            return res.status(404).json({ error: "Company not found." });
        }

        const query = { company: companyId, status: status };


        const sortOptions = {};
        sortOptions[sortBy] = sortOrder === 'asc' ? 1 : -1;

        const jobs = await Job.find(query)
            // .populate('company', 'name logo') // No need to populate company again if filtering by it
            .sort(sortOptions)
            .skip((parseInt(page) - 1) * parseInt(limit))
            .limit(parseInt(limit));

        const totalJobs = await Job.countDocuments(query);

        res.status(200).json({
            jobs,
            companyName: companyExists.name, // Add company name to response for context
            currentPage: parseInt(page),
            totalPages: Math.ceil(totalJobs / parseInt(limit)),
            totalJobs
        });

    } catch (error) {
        console.error("Error fetching company jobs:", error.message, error.stack);
        res.status(500).json({ error: "Internal server error" });
    }
};

// --- Job Stats (from existing, needs adjustment for new model) ---
// This jobStats function needs to be re-evaluated with the new Job model structure
// and how 'createdBy' vs 'postedBy' and 'company' are used.
// For now, I will comment it out as it might not directly align with the new schemas
// without careful review and adjustment.

/*
export const jobStats = async (req, res) => {
    // ... existing jobStats logic ...
    // Needs to be updated to use `postedBy` (User ref) and `company` (Company ref)
    // and ensure the aggregation queries make sense with the new structure.
    // For example, stats might be per company or per employer.
    res.status(501).json({ message: "Job stats endpoint needs review and update." });
} 
*/

// @desc    Get similar jobs based on the current job's attributes
// @route   GET /api/jobs/:jobId/similar
// @access  Public
export const getSimilarJobs = async (req, res) => {
    try {
        const { jobId } = req.params;
        const currentJob = await Job.findById(jobId).lean(); // .lean() for a plain JS object, faster

        if (!currentJob) {
            return res.status(404).json({ error: "Original job not found." });
        }

        const query = {
            _id: { $ne: currentJob._id }, // Exclude the current job
            status: 'open', // Only recommend open jobs
            category: currentJob.category,
            employmentType: currentJob.employmentType,
            // For location, an exact match. Could be expanded with geospatial later.
            // location: currentJob.location,
        };

        // Optional: Add more nuanced matching, e.g., for location or experience level
        if (currentJob.location) {
            query.location = currentJob.location; // Simple exact match for now
        }
        if (currentJob.experienceLevel) {
            query.experienceLevel = currentJob.experienceLevel;
        }

        // Attempt to find jobs with at least one matching requirement/skill keyword if requirements are not empty
        // This is a very basic way to simulate skill matching. A dedicated tags/skills array would be better.
        if (currentJob.requirements && currentJob.requirements.length > 0) {
            // Create a regex from some keywords in requirements. This is naive.
            // A better approach would be to have a dedicated 'skills' array and use $in.
            // Or, if requirements are structured, match on those.
            // For simplicity here, we'll just add it as an optional filter if other criteria yield too few results,
            // or we can add a few more jobs based on this if the primary query is too restrictive.
            // For now, let's stick to simpler criteria.
        }

        let similarJobs = await Job.find(query)
            .populate('company', 'name logo')
            .limit(5) // Limit to 5 similar jobs
            .sort({ createdAt: -1 }); // Sort by newest

        // If not enough jobs found with strict criteria, broaden the search slightly
        // For example, remove experienceLevel or location match if less than 3 jobs found
        if (similarJobs.length < 3) {
            delete query.experienceLevel; // Broaden by removing experience level
            // Could also try removing location match if still not enough: delete query.location;

            let broaderJobs = await Job.find(query)
                .populate('company', 'name logo')
                .limit(5)
                .sort({ createdAt: -1 });

            // Merge and ensure uniqueness if needed, or just replace if the broader set is preferred
            similarJobs = broaderJobs;
        }

        // If still very few, could try matching only category and type
        if (similarJobs.length < 2 && currentJob.category && currentJob.employmentType) {
             const veryBroadQuery = {
                _id: { $ne: currentJob._id },
                status: 'open',
                category: currentJob.category,
                // employmentType: currentJob.employmentType, // Optionally relax this too
             };
             let veryBroadJobs = await Job.find(veryBroadQuery)
                .populate('company', 'name logo')
                .limit(5)
                .sort({ createdAt: -1 });
            similarJobs = similarJobs.concat(veryBroadJobs.filter(j => !similarJobs.find(sj => sj._id.equals(j._id)))).slice(0,5);
        }


        res.status(200).json(similarJobs);

    } catch (error) {
        console.error("Error fetching similar jobs:", error.message, error.stack);
        res.status(500).json({ error: "Internal server error" });
    }
};
