import User from "../models/user.model.js";

const registerUser = async (req, res) => {
    try {
        const { fullName, phoneNumber, password } = req.body;
        const normalizedFullName = (fullName || "").trim();
        const normalizedPhoneNumber = (phoneNumber || "").trim();

        // basic validation

        if(!normalizedFullName || !normalizedPhoneNumber || !password){
            return res.status(400).json({message: "Full name, phone number and password are required"});
        }

        // check if user already exists

        const existingUser = await User.findOne({ phoneNumber: normalizedPhoneNumber });
        if (existingUser){
            return res.status(400).json({message: "User with this phone number already exists"});
        }

        // create new user

        const user = await User.create({
            fullName: normalizedFullName,
            phoneNumber: normalizedPhoneNumber,
            password,
        });
        res.status(201).json({message: "User registered successfully", user: { _id: user._id, fullName: user.fullName, phoneNumber: user.phoneNumber }});
    }catch(error){
        res.status(500).json({message: "Error registering user", error: error.message});
    }
};

const loginUser = async (req, res) => {
    try {
        const { phoneNumber, password } = req.body;
        const normalizedPhoneNumber = (phoneNumber || "").trim();

        if (!normalizedPhoneNumber || !password) {
            return res.status(400).json({ message: "Phone number and password are required" });
        }

        const user = await User.findOne({ phoneNumber: normalizedPhoneNumber });
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const isValidPassword = await user.isPasswordCorrect(password);
        if (!isValidPassword) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        return res.status(200).json({
            message: "Login successful",
            user: { _id: user._id, fullName: user.fullName, phoneNumber: user.phoneNumber },
        });
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ message: "Error logging in user", error: error.message });
    }
};

export { registerUser, loginUser };
