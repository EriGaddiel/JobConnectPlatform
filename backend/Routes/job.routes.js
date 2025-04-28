import express from 'express';
import { postJob, getAllJobs, getJobById, updateJob, deleteJob } from '../Controllers/job.controller.js';


const router = express.Router()

router.post('/jobs', postJob);  
router.get('/jobs', getAllJobs);  
router.get('/jobs/:id', getJobById);  
router.put('/jobs/:id', updateJob);  
router.delete('/jobs/:id', deleteJob);  

export default router;
