import mongoose from "mongoose"

const userSchema = await mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    fullName: {
        type: String,
        required: true
    }, 
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true, 
        minLength: 6
    },
    userType: {
        type: String,
        enum: ["jobSeeker", "employer"],
        default: "jobSeeker"
    },
    profileImg: {
        type: String,
        default:""
    },
    bio: {
        type: String
    },
    skills: {
        type: [String]
    },
    location: {
        type: String,
        default: ""
    }

}, {timestamps: true})

const User = mongoose.model("User", userSchema)

export default User