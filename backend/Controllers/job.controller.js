import Job from '../Models/job.model.js'  
import mongoose, { mongo } from 'mongoose'
import moment from 'moment'

export const postJob = async (req, res) => {  
    try {  
        const { title, description, company, location, salary, employmentType, requirements } = req.body;  
        const newJob = new Job({ title, description, company, location, salary, employmentType, requirements, createdBy: req.user.id});  
        await newJob.save();  

        res.status(201).json({ message: "Job posted successfully!" });  
    } catch (error) {  
        res.status(500).json({ error: "Internal server error" });  
        console.log(`Error occurred in the Job controller: ${error.message}`);  
    }  
};  

export const getAllJobs = async (req, res) => {  
    try {  
        const jobs = await Job.find().populate('company', 'username');  
        res.status(200).json(jobs);  
    } catch (error) {  
        res.status(500).json({ error: "Internal server error" });  
        console.log(`Error occurred in the Job controller: ${error.message}`);  
    }  
};  
  
export const getJobById = async (req, res) => {  
    // Logic to get job by ID  
};  

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
        pending: stats.pending || 0,
        reject: stats.reject || 0,
        interview: stats.interview || 0
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
