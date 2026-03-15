import User from "../models/user.model.js";

const registerUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // basic validation

        if(!email || !password){
            return res.status(400).json({message: "All fields are required"});
        }

        // check if user already exists

        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser){
            return res.status(400).json({message: "User with this email already exists"});
        }

        // create new user

        const user = await User.create({
            email: email.toLowerCase(),
            password,
        });
        res.status(201).json({message: "User registered successfully", user: { _id: user._id, email: user.email }});
    }catch(error){
        res.status(500).json({message: "Error registering user", error: error.message});
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        const isValidPassword = await user.isPasswordCorrect(password);
        if (!isValidPassword) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        return res.status(200).json({
            message: "Login successful",
            user: { _id: user._id, email: user.email },
        });
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ message: "Error logging in user", error: error.message });
    }
};

export { registerUser, loginUser };
