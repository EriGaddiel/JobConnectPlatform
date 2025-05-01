import express from 'express'
import { protectRoute } from '../middleware/protectRoute.js'
import { updateUser } from '../Controllers/user.controller.js'

const router = express.Router()

router.post('/update', protectRoute, updateUser)

export default router