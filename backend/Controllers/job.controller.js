import Job from '../Models/job.model.js'  
import mongoose, { mongo } from 'mongoose'
import moment from 'moment'

export const postJob = async (req, res) => {  
    try {  
        const { title, description, company, location, salary, employmentType, requirements } = req.body  
        const newJob = new Job({ title, description, company, location, salary, employmentType, requirements, createdBy: req.user.id})  
        await newJob.save()  

        res.status(201).json({ message: "Job posted successfully!" })  
    } catch (error) {  
        res.status(500).json({ error: "Internal server error" })  
        console.log(`Error occurred in the Job controller: ${error.message}`)  
    }  
}  

/**
 * @route GET /api/jobs/get-jobs
 * @description Fetches jobs based on various filter criteria.
 *              Supports public searching and viewing jobs created by the authenticated user.
 * @access Private (requires authentication token via protectRoute middleware)
 * 
 * @queryparam {String} [view] - Set to 'public' to search all open jobs. 
 *                             If not 'public' or omitted, shows jobs created by the authenticated user.
 * @queryparam {String} [keyword] - Search term for job titles and descriptions (case-insensitive).
 * @queryparam {String} [location] - Filters by job location (partial match, case-insensitive).
 * @queryparam {Number} [minSalary] - Minimum salary. Effectiveness depends on the 'salary' field's data format in the database.
 * @queryparam {Number} [maxSalary] - Maximum salary. Effectiveness depends on the 'salary' field's data format in the database.
 * @queryparam {String} [skills] - Comma-separated list of required skills (e.g., "javascript,react,node"). 
 *                                Jobs returned will match all listed skills.
 * @queryparam {String} [postedWithin] - Filters jobs posted within a specified period 
 *                                      (e.g., "7d" for last 7 days, "30d" for last 30 days).
 * @queryparam {String} [status] - Filters by job status (e.g., 'open', 'close'). 
 *                                Only applicable when 'view' is not 'public'.
 * @queryparam {String} [employmentType] - Filters by employment type 
 *                                        (e.g., 'full-time', 'part-time', 'contract', 'freelance').
 * @queryparam {String} [company] - Filters by company name (partial match, case-insensitive).
 * @queryparam {String} [sort] - Sort order: 'latest' (default), 'oldest', 'a-z' (by title), 'z-a' (by title).
 * @queryparam {Number} [page] - Page number for pagination (default: 1).
 * @queryparam {Number} [limit] - Number of results per page (default: 10).
 * 
 * @returns {Object} JSON response containing:
 * - totalJobs {Number} - Total number of jobs matching the criteria.
 * - jobs {Array<Object>} - Array of job objects.
 * - numOfPage {Number} - Total number of pages.
 * - currentPage {Number} - The current page number.
 */
export const getAllJobs = async (req, res) => {
    try {
        const {
            view, keyword, location, minSalary, maxSalary, skills, postedWithin,
            status, employmentType, company, sort, page: pageQuery, limit: limitQuery
        } = req.query;

        const queryObject = {};

        // View type: public or user's own jobs
        if (view === 'public') {
            queryObject.status = 'open'; // Public can only see open jobs
        } else {
            // Default to employer's own jobs or specific user view
            if (!req.user || !req.user.id) {
                // If trying to access user-specific jobs without being authenticated for it
                return res.status(401).json({ error: "Authentication required to view these jobs" });
            }
            queryObject.createdBy = req.user.id;
            // For user's own jobs, allow existing status filter
            if (status && status !== 'all') {
                queryObject.status = status;
            }
        }

        // Keyword search (title and description)
        if (keyword) {
            queryObject.$or = [
                { title: { $regex: keyword, $options: 'i' } },
                { description: { $regex: keyword, $options: 'i' } }
            ];
        }

        // Location search
        if (location) {
            queryObject.location = { $regex: location, $options: 'i' };
        }

        // Salary range filter
        const salaryQueryPart = {};
        if (minSalary && !isNaN(parseFloat(minSalary))) {
            salaryQueryPart.$gte = parseFloat(minSalary);
        }
        if (maxSalary && !isNaN(parseFloat(maxSalary))) {
            salaryQueryPart.$lte = parseFloat(maxSalary);
        }
        if (Object.keys(salaryQueryPart).length > 0) {
            queryObject.salary = salaryQueryPart;
        }
        
        // Skills (requirements) - must match all listed skills
        if (skills) {
            const skillsArray = skills.split(',').map(skill => skill.trim()).filter(skill => skill);
            if (skillsArray.length > 0) {
                queryObject.requirements = { $all: skillsArray };
            }
        }

        // Date posted filter (e.g., postedWithin=7d)
        if (postedWithin) {
            const days = parseInt(String(postedWithin).replace('d', ''), 10);
            if (!isNaN(days) && days > 0) {
                queryObject.createdAt = { $gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000) };
            }
        }

        // Employment type filter
        if (employmentType && employmentType !== 'all') {
            queryObject.employmentType = employmentType;
        }

        // Company name filter
        if (company) { // Removed '&& company !== "all"' for free-text search
            queryObject.company = { $regex: company, $options: 'i' };
        }

        let queryResult = Job.find(queryObject);

        // Sorting
        if (sort === 'latest') {
            queryResult = queryResult.sort('-createdAt');
        } else if (sort === 'oldest') {
            queryResult = queryResult.sort('createdAt');
        } else if (sort === 'a-z') {
            queryResult = queryResult.sort('title');
        } else if (sort === 'z-a') {
            queryResult = queryResult.sort('-title');
        } else {
            queryResult = queryResult.sort('-createdAt'); // Default sort
        }
        
        // Pagination
        const page = Number(pageQuery) || 1;
        const limit = Number(limitQuery) || 10;
        const skip = (page - 1) * limit;

        // Get total count before pagination
        const totalJobs = await Job.countDocuments(queryObject); // Corrected: use queryObject
        const numOfPage = Math.ceil(totalJobs / limit);

        queryResult = queryResult.skip(skip).limit(limit);
        const jobs = await queryResult;

        res.status(200).json({ totalJobs, jobs, numOfPage, currentPage: page });

    } catch (error) {
        console.error(`Error in getAllJobs controller: ${error.message}`, error.stack); // Log more details
        res.status(500).json({ error: "Internal server error" });
    }
};
  
export const getJobById = async (req, res) => {  
    // Logic to get job by ID  
}  

export const updateJob = async (req, res) => {  
    try{
        const { id } = req.params  
        const { title, description, location, salary, employmentType, requirements } = req.body 

        const job = await Job.findById(id)
        if (!job) {  
            return res.status(404).json({ message: "Job not found" })  
        }  

        if (job.company.toString() === req.user.id) {  
            return res.status(403).json({ message: "You are not authorized to update this job" })  
        }  

        job.title = title || job.title
        job.description = description || job.description 
        job.location = location || job.location
        job.salary = salary || job.salary
        job.employmentType = employmentType || job.employmentType
        job.requirements = requirements || job.requirements

        await job.save()

        res.status(200).json({ message: "Job updated successfully!", job })
    } catch (error) {  
        res.status(500).json({ error: "Internal server error", detail: error.message }) 
        console.log(`Error occurred while updating job: ${error.message}`)
    } 
}
 
export const deleteJob = async (req, res) => {  
    try {  
        const { id } = req.params
  
        const job = await Job.findById(id)
        if (!job) {  
            return res.status(404).json({ message: "Job not found" })
        }  
 
        if (job.company.toString() === !req.user.id) {  
            return res.status(403).json({ message: "You are not authorized to delete this job" })
        }  

        await Job.findByIdAndDelete(id)

        res.status(200).json({ message: "Job deleted successfully!" })
    } catch (error) {  
        res.status(500).json({ error: "Internal server error", detail: error.message })
        console.log(`Error occurred while deleting job: ${error.message}`)
    }   
}


export const jobStats = async (req, res) => {  
    const stats = await Job.aggregate([
        {
            $match: {
                createdBy: new mongoose.Types.ObjectId(req.user.id),
            },
        },

        {
            $group: {
                _id: '$status', count: { $sum : 1},
            }
        }
    ])

    const defaultStats = {
        pending: stats.open || 0,
        reject: stats.close || 0,
    }

    let monthlyApplication = await Job.aggregate([
        {
            $match: {
                createdBy: new mongoose.Types.ObjectId(req.user.id)
            },
        },
        {
            $group:{
                _id: {
                    year: { $year: '$createdAt' },
                    month: { $month: '$createdAt' }
                },
                count: { $sum: 1 }
            },
        },
    ])

    monthlyApplication = monthlyApplication.map(item => {
        const {_id: {year,month}, count} = item
        const date = moment().month(month - 1).year(year).format('MMM Y')
        return {date, count}
    }).reverse()

    res.status(200).json({ totalJobs: stats.length, defaultStats, monthlyApplication })
} 
