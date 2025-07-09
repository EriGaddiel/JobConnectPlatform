import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    recipient: { // User receiving the notification
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    sender: { // User or System that triggered the notification
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Can be null if system-generated
    },
    type: {
        type: String,
        required: true,
        enum: [
            "new_job_application",      // For employer: when a new application is submitted for their job
            "application_status_update",// For job seeker: when their application status changes
            "new_message",              // For user: when they receive a new message
            "job_recommendation",       // For job seeker: new job match (future feature)
            "saved_job_alert",          // For job seeker: e.g., application deadline approaching for a saved job
            "review_posted",            // For company: when a new review is posted for their company (future feature)
            "interview_scheduled",      // For both: when an interview is scheduled
            // System notifications
            "password_reset_success",
            "email_verified_success",
            "welcome_message",
            // Add more types as needed
        ]
    },
    message: { // The notification text/summary
        type: String,
        required: true,
    },
    link: { // URL to navigate to when notification is clicked (e.g., application page, job page, message thread)
        type: String,
    },
    isRead: {
        type: Boolean,
        default: false,
    },
    entityId: { // ID of the related entity (e.g., Application._id, Job._id, User._id for sender)
        type: mongoose.Schema.Types.ObjectId,
    },
    entityType: { // Name of the related entity's model (e.g., "Application", "Job", "User")
        type: String
    }
}, { timestamps: true });

// Index for querying notifications efficiently for a user, sorted by date, and optionally by read status
notificationSchema.index({ recipient: 1, isRead: 1, createdAt: -1 });

const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;
