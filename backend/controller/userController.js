import User from "../modal/usermodel.js";
import dotenv from "dotenv";
dotenv.config();
export const RegisterController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email is already registered." });
    }

    const user = new User({ email, password });
    await user.save();

    const token = user.generateToken();

    res.status(201).json({
      message: "User registered successfully.",
      user: {
        id: user._id,
        email: user.email,
      },
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

export const LoginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    const token = user.generateToken();
    console.log(token);

    // Set the token as an HTTP-only cookie
    // res.cookie("token", token, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === "production", // Use secure cookies in production
    //   sameSite: "strict", // Prevent CSRF
    //   maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days expiration
    // });

    res.status(200).json({
      message: "Login successful.",
      user: {
        id: user._id,
        email: user.email,
        token: token,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

export const ProfileController = async (req, res) => {
  res.status(200).json({ message: "user profile send successfully" });
};

export const LogoutController = async (req, res) => {
  try {
    // Clear the cookie storing the token
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    res.status(200).json({
      success: true,
      message: "User logged out successfully.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error. Unable to log out.",
    });
  }
};

export const getAllUsersController = async (req, res) => {
  try {
    // Fetch all users from the database
    const users = await User.find().select("-password"); // Exclude passwords for security

    // Check if users exist
    if (!users || users.length === 0) {
      return res.status(404).json({ success: false, message: "No users found" });
    }

    // Send users in response
    return res.status(200).json({ success: true, users });
  } catch (error) {
    console.error("Error fetching users:", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Failed to fetch users" });
  }
};