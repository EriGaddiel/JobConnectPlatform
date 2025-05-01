import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import cookieParser from 'cookie-parser'

import helmet from "helmet"
import xss from 'xss-clean'
import ExpressMongoSanitize from "express-mongo-sanitize"

import authRoutes from "./Routes/auth.routes.js"
import userRoutes from "./Routes/user.routes.js"
import jobRoutes from "./Routes/job.routes.js"

import connectMongoDB from "./db/connectMongoDB.js"

dotenv.config()

const app = express()
const port = process.env.PORT || 5000

app.use(express.json())
app.use(express.urlencoded({ extended: true}))

app.use(cors())
app.use(helmet())
app.use(xss())
app.use(ExpressMongoSanitize())
app.use(cookieParser())

app.use("/api/auth", authRoutes)
app.use("/api/user", userRoutes)
app.use("/api/jobs", jobRoutes)



app.listen(port, () => {
    console.log(`Server is running on port: ${port}`)
    connectMongoDB()
})

