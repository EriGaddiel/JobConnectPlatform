import express from 'express'
import { postJob, getAllJobs, getJobById, updateJob, deleteJob, jobStats } from '../Controllers/job.controller.js'
import { protectRoute } from '../middleware/protectRoute.js'
import { checkRole } from '../middleware/checkRole.js'


const router = express.Router()

router.post('/post-job', protectRoute, checkRole('employer'),postJob)  
router.get('/get-jobs',protectRoute, getAllJobs)  
// router.get('/jobs/:id', getJobById)  
router.post('/update-job/:id', protectRoute, checkRole('employer'),updateJob)  
router.delete('/delete-job/:id', protectRoute, checkRole('employer'),deleteJob)  
router.get('/job-stats', protectRoute,jobStats)  

export default router
