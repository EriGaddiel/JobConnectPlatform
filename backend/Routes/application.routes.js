// routes/application.routes.js  
import express from 'express'   
import {getApplicationsByUser, getApplicationsByJob, applyForJob, updateApplicationStatus, deleteApplication} from '../Controllers/application.controller.js'
import { protectRoute } from '../middleware/protectRoute.js'   
import { checkRole } from '../middleware/checkRole.js'   

const router = express.Router()   
  
router.post('/:jobId/apply', protectRoute, checkRole('jobSeeker'),applyForJob)   
router.get('/', protectRoute, getApplicationsByUser)   
router.post('/update-status', protectRoute,checkRole('jobSeeker'),updateApplicationStatus)   
router.delete('/:id', protectRoute, checkRole('jobSeeker'),deleteApplication)   
router.get('/job/:jobId', protectRoute, checkRole('employer'),getApplicationsByJob)   

export default router 