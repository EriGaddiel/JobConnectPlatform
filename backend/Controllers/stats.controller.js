import Job from '../Models/job.model.js'  
import mongoose from 'mongoose';

export const jobStats = async (req, res) => {  
    const stats = await Job.aggregate([
        {
            $match: {
                createdBy: new mongoose.Types.ObjectId(req.user.id),
            },
        },
    ])

}  