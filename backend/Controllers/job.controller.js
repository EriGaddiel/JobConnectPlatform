import Job from '../Models/job.model.js'  

export const postJob = async (req, res) => {  
    try {  
        const { title, description, company, location, salary, employmentType, requirements } = req.body;  
        const newJob = new Job({ title, description, company: req.user.id, location, salary, employmentType, requirements });  
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
    // Logic for updating job details  
};  
 
export const deleteJob = async (req, res) => {  
    // Logic for deleting a job  
};  
