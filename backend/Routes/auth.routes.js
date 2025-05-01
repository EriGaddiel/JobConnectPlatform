import express from "express"
import { signup, login, logout, getMe } from "../Controllers/auth.controller.js"
import { protectRoute } from '../middleware/protectRoute.js'
import rateLimit from "express-rate-limit"

const limiter = rateLimit({
    windowMs: 15 * 60 * 100,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false
})

const router = express.Router()

router.get("/me", protectRoute,getMe)

router.post("/signup", limiter,signup)

router.post("/login", limiter,login)

router.post("/logout", logout)


export default router