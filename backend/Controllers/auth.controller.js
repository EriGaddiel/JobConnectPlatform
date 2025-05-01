import User from "../Models/user.model.js"
import bcrypt  from "bcryptjs"

import { generateTokenAndSetCookie } from "../lib/utils/generateToken.js"

export const signup = async (req, res) =>{
    try {
        const { fullName, username, email, password } = req.body

        // if (!fullName || !username || !email || !password) {
        //    return res.status(400).json({ error: "All fields are required"})
        // }


        const emailRegex = /^[^\$@]+@[^\$@]+\.[^\$@]+$/
        if (!emailRegex.test(email)) {
            return res.status(400).json( {error: " Invalid email format"})
        }

        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json( {error: " Username is already taken"})
        }

        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json( {error: " Email is already taken"})
        }

        if (password.length < 6) {
            return res.status(400).json({error: "Password most be at least 6 characters long"})
        }

        const salt = await bcrypt.genSalt(12)
        const hashPassword = await bcrypt.hash(password, salt)

        const newUser = new User({
            username,
            fullName,
            email,
            password: hashPassword
        })

        if (newUser) {
            generateTokenAndSetCookie(newUser._id, res)
            await newUser.save()

            const {password: pass, ...rest} = newUser._doc

            return res.status(200).json(rest) 
            
        }else{
            res.status(400).json({ error: "Invalid user data"})
        }      

    } catch (error) {
        res.status(500).json({ error: "Internal server errors"})
        console.log(`Error occur in the signup controller: ${error.message}`)
    }
}

export const login = async (req, res) => {  
    try {  
        const { usernameOrEmail, password } = req.body;  
 
        if (!usernameOrEmail || !password) {  
            return res.status(400).json({ error: "Both username/email and password are required" });  
        }  
        const user = await User.findOne({  
            $or: [{ username: usernameOrEmail }, { email: usernameOrEmail }]  
        });  
  
        if (!user) {  
            return res.status(400).json({ error: "Invalid username/email or password" });  
        }  

        const isMatch = await bcrypt.compare(password, user.password);  
        if (!isMatch) {  
            return res.status(400).json({ error: "Invalid username/email or password" });  
        }  

        generateTokenAndSetCookie(user._id, res);  

        const { password: pass, ...rest } = user._doc;  

        return res.status(200).json(rest);  

    } catch (error) {  
        res.status(500).json({ error: "Internal server error" });  
        console.log(`Error occurred in the login controller: ${error.message}`);  
    }  
}

export const logout = async (req, res) => {  
    try {  
        res.clearCookie('jwt'); 

        return res.status(200).json({ message: "Successfully logged out" });  
    } catch (error) {  
        res.status(500).json({ error: "Internal server error" });  
        console.log(`Error occurred in the logout controller: ${error.message}`);  
    }  
} 

export const getMe = async (req, res) =>{
    try {
        const user = req.user;  
 
        return res.status(200).json({ user });
    } catch (error) {
        console.log("Error in the getMe controller", error.message)
        return res.status(500).json({error: "Internal Server Error"})
    }
}