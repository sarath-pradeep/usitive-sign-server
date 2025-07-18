import jwtService from "../services/jwtService.js";
import UserDetails from "../models/userDetails.js";
import { sendEmail } from "../services/mailerService.js";
import bcrypt from "bcryptjs";

const otpVerficationStore = {};

const addUser = async (req, res) => {

    try{
        if (!req.body || typeof req.body !== 'object') {
            return res.status(400).json({ error: "Email and password are required" });
        }
        const {firstName, lastName, email, companyName, referralSource} = req.body;
        if(!firstName || !lastName || !email) {
            return res.status(400).json({error: "First name, last name and email are required"});
        }

        // Check if user already exists
        const existingUser = await UserDetails.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "User Email already exists" });
        }

        // Create new user
        const newUser = new UserDetails({
            firstName,
            lastName,
            email,
            companyName,
            referralSource
        });
        await newUser.save();
        
        // Send Otp
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        otpVerficationStore[email] = otp;

        const emailSent = await sendEmail(email, "OTP Verification", `<p>Your OTP is: <strong>${otp}</strong></p>`);
        if (!emailSent) {
            return res.status(500).json({ error: "Failed to send OTP email" });
        }
        return res.status(201).json({ message: "OTP has been send to User", email });
    } catch (error) {
        console.error("Error adding user:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) {
            return res.status(400).json({ error: "Email and OTP are required" });
        }

        // Check if OTP matches
        const sanitizedOtp = String(otp).trim();
        const storedOtp = String(otpVerficationStore[email]).trim();     

        if (sanitizedOtp !== storedOtp) {
            return res.status(400).json({ error: "Invalid OTP" });
        }

        // Clear OTP from store
        delete otpVerficationStore[email];

        const type = req.query.type || "setPassword";
        if(type === 'login') {
            // If OTP is verified for login, return success
            const user = await UserDetails.findOne({ email });
            if (!user) {
                return res.status(404).json({ error: "User not found" });
            }
            // Generate JWT token for login
            const token = jwtService.generateToken({ userId: user._id, email: user.email });
            return res.status(200).json({ success: true, message: "OTP verified successfully for login", token });
        } else if(type === 'setPassword') {
            // If OTP is verified for setting password, return success
            return res.status(200).json({ success: true, message: "OTP verified successfully for setting password" });
        }
    } catch (error) {
        console.error("Error verifying OTP:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

const setPassword = async (req, res) => {
    try{
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }

        // Check if user exists
        const user = await UserDetails.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        await user.save();

        return res.status(200).json({ message: "Password set successfully" });
    } catch (error) {
        console.error("Error setting password:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

const login = async (req, res) => {
    try {
        if (!req.body || typeof req.body !== 'object') {
            return res.status(400).json({ error: "Email and password are required" });
        }
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }

        // Check if user exists
        const user = await UserDetails.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid password" });
        }

        if(user.is2FactAuthEnabled) {
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            otpVerficationStore[email] = otp;
            const emailSent = await sendEmail(email, "OTP Verification", `<p>Your OTP is: <strong>${otp}</strong></p>`);
            if (!emailSent) {
                return res.status(500).json({ error: "Failed to send OTP email" });
            }
            return res.status(403).json({ error: "Two-factor authentication is enabled. Please verify your OTP." });
        }

        // Generate JWT token
        const token = jwtService.generateToken({ userId: user._id, email: user.email });

        return res.status(200).json({ message: "Login successful", token });
    } catch (error) {
        console.error("Error logging in:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}


export default {
    addUser,
    verifyOtp,
    setPassword,
    login
};
