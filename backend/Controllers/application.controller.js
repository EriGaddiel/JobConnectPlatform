import Application from '../Models/application.model.js'

export const applyForJob = async (req, res) => {  
    const { coverLetter, resume, phoneNumber,preferredWorkingType } = req.body
    const {jobId} = req.params
    try {  
        const application = new Application({  
            applicant: req.user._id,  
            job: jobId,  
            coverLetter,  
            resume,  
            phoneNumber,
            preferredWorkingType  
        })  

        await application.save()  
        res.status(201).json({ message: "Application submitted successfully.", application })  
    } catch (error) {  
        res.status(500).json({ error: error.message })  
    }  
}  

export const getApplicationsByUser = async (req, res) => {  
    try {  
        const applications = await Application.find({ applicant: req.user._id }).populate('job', 'title company')  
        res.status(200).json({ totalApplications: applications.length, applications})  
    } catch (error) {  
        res.status(500).json({ error: error.message })  
    }  
}  

export const updateApplicationStatus = async (req, res) => {  
    const { applicationId, status } = req.body  

    try {  
        const application = await Application.findById(applicationId)  
        if (!application) {  
            return res.status(404).json({ error: "Application not found." })  
        }  

        application.status = status  
        await application.save()  

        res.status(200).json({ message: "Application status updated.", application })  
    } catch (error) {  
        res.status(500).json({ error: error.message })  
    }  
}  

export const deleteApplication = async (req, res) => {  
    const { applicationId } = req.params  

    try {  
        await Application.findByIdAndDelete(applicationId)  

        res.status(200).json({ message: "Application deleted successfully." })  
    } catch (error) {  
        res.status(500).json({ error: error.message })  
    }  
}  

export const getApplicationsByJob = async (req, res) => {  
    const { jobId } = req.params  

    try {  
        const applications = await Application.find({ job: jobId }).populate('applicant', 'username fullName')  
        res.status(200).json({totalApplications: applications.length, applications})  
    } catch (error) {  
        res.status(500).json({ error: error.message })  
    }  
}