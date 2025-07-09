import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import cookieParser from 'cookie-parser'

import helmet from "helmet"
import xss from 'xss-clean'
import ExpressMongoSanitize from "express-mongo-sanitize"

import authRoutes from "./Routes/auth.routes.js"
import userRoutes from "./Routes/user.routes.js";
import jobRoutes from "./Routes/job.routes.js";
import applicationRoutes from "./Routes/application.routes.js";
import companyRoutes from "./Routes/company.routes.js";
import analyticsRoutes from "./Routes/analytics.routes.js"; // Import analytics routes

import connectMongoDB from "./db/connectMongoDB.js";

dotenv.config();

import { Server } from "socket.io"; // Import Server from socket.io
import http from "http"; // Import http module

const app = express();
const server = http.createServer(app); // Create HTTP server for Socket.IO

// Initialize Socket.IO
const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL || "http://localhost:5173", // Client URL from .env or default
        methods: ["GET", "POST"]
    }
});

const port = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true}));

app.use(cors())
app.use(helmet())
app.use(xss())
app.use(ExpressMongoSanitize())
app.use(cookieParser())

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/companies", companyRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/analytics", analyticsRoutes); // Add analytics routes


// Socket.IO connection handling
const userSocketMap = {}; // Maps userId to socketId

io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    const userId = socket.handshake.query.userId; // Get userId from handshake query (client needs to send this)
    if (userId && userId !== "undefined") { // "undefined" can be a string here
        userSocketMap[userId] = socket.id;
        console.log(`User ${userId} mapped to socket ${socket.id}`);
    }

    // Example: Listen for a custom event to register user explicitly after connection if handshake is not preferred
    socket.on("registerUser", (id) => {
        if (id) {
            userSocketMap[id] = socket.id;
            console.log(`User ${id} explicitly registered to socket ${socket.id}`);
            // Optionally, join a room for this user
            socket.join(id.toString()); // User joins a room named after their ID
        }
    });


    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
        // Remove user from map
        for (const [uid, sid] of Object.entries(userSocketMap)) {
            if (sid === socket.id) {
                delete userSocketMap[uid];
                console.log(`User ${uid} unmapped from socket ${socket.id}`);
                break;
            }
        }
    });

    // Example: Listen for a message and broadcast it (for chat functionality later)
    // socket.on('sendMessage', ({ recipientId, message }) => {
    //     const recipientSocketId = userSocketMap[recipientId];
    //     if (recipientSocketId) {
    //         io.to(recipientSocketId).emit('newMessage', { senderId: userId, message });
    //     }
    // });
});


// Export io instance so it can be used in controllers
export { io, userSocketMap };


// Change app.listen to server.listen
server.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
    connectMongoDB();
});

