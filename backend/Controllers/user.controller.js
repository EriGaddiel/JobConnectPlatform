import User from "../Models/user.model.js"
import bcrypt from "bcryptjs"

export const updateUser  = async (req, res) => {
    const {fullName, username ,email, currentPassword, newPassword} = req.body

    const userId = req.user._id

    try{
        const user = await User.findById(userId)
        if (!user) return res.status(404).json({message: "User not found"})

        if((!newPassword && currentPassword) || (!currentPassword && newPassword)){
            return res.status(400).json({error: "Please provide both current password and new password"})
        }

        if(currentPassword && newPassword) {
            const isMatch = await bcrypt.compare(currentPassword, user.password)
            if(!isMatch) return res.status(400).json({error: "Current password is incorrect"})
            if (newPassword.length < 6) {
                return res.status(400).json({ error: "Password must be at least 6 characters long"})
            }

            const salt = await bcrypt.genSalt(12)
            user.password = await bcrypt.hash(newPassword, salt)
        }
        user.fullName = fullName || user.fullName
        user.username = username || user.username
        user.email = email || user.email

        const updatedUser = await user.save()

        const { password: pass, ...rest } = updatedUser._doc  

        return res.status(200).json(rest)
    }catch(error){

    }
}