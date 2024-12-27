import express from "express";
import mongoose from "mongoose";
import {
  userSignupSchema,
  userSigninSchema,
  changePasswordSchema,
} from "../zod/zodUserSchema.js";
import { User } from "../models/userSchema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// sign-up route

router.post("/signup", async (req, res) => {
  try {
    // Step 1: Zod Validation
    const validateData = userSignupSchema.parse(req.body);

    // Step 2: Check if User Already Exists
    const existingUser = await User.findOne({
      email: validateData.email,
    });

    if (existingUser) {
      return res.status(400).json({
        msg: "Email already exists. Please choose another email.",
      });
    }

    // Step 3: Hash the Password with bcrypt
    const salt = await bcrypt.genSalt(10); // Generate Salt
    const hashedPassword = await bcrypt.hash(validateData.password, salt); // Hash Password

    // Step 4: Create the New User with Hashed Password
    const newUser = await User.create({
      email: validateData.email,
      password: hashedPassword,
      firstName: validateData.firstName,
      lastName: validateData.lastName,
    });

    // Generate Token
    const token = jwt.sign(
      {
        id: newUser._id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
      },
      process.env.JWT_SECRET
    );

    // Step 5: Send Success Response
    res.status(200).json({
      msg: "Successfully created new user!",
      token: token,
      userId: newUser._id, // Ensure the response includes userId explicitly
      user: {
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
      },
    });
  } catch (error) {
    // Step 6: Handle Zod Validation Errors
    if (error.errors) {
      return res.status(400).json({ errors: error.errors });
    }
    // Handle Other Server Errors
    res.status(500).json({ message: error.message });
  }
});

// Get all users
router.get("/allUsers", async (req, res) => {
  try {
    const filter = req.query.filter || ""; // Get the search query parameter
    const excludeUserId = req.query.excludeUserId || null; // Get the logged-in user ID

    // Validate ObjectId if excludeUserId exists
    if (excludeUserId && !mongoose.Types.ObjectId.isValid(excludeUserId)) {
      throw new Error("Invalid User ID format for exclusion");
    }

    const regex = new RegExp(filter, "i"); // Create a case-insensitive regex

    // Build the query
    const query = {
      $or: [
        { email: { $regex: regex } },
        { firstName: { $regex: regex } },
        { lastName: { $regex: regex } },
      ],
    };

    if (excludeUserId) {
      query._id = { $ne: new mongoose.Types.ObjectId(excludeUserId) };
    }

    const allUsers = await User.find(query);


    res.status(200).json({
      msg: "List of filtered users",
      users: allUsers,
    });
  } catch (error) {
    console.error("❌ Error fetching users:", error.message);
    res.status(500).json({ message: error.message });
  }
});

// signin route

router.post("/signin", async (req, res) => {
  try {
    const validatedData = userSigninSchema.parse(req.body);

    // Check if user exists
    const user = await User.findOne({ email: validatedData.email });
    if (!user) {
      return res.status(400).json({
        msg: "Invalid email or password",
      });
    }

    // Check Password
    const passwordCheck = await bcrypt.compare(
      validatedData.password,
      user.password
    );

    if (!passwordCheck) {
      return res.status(400).json({ msg: "Invalid email or password" });
    }

    // Generate Token
    const token = jwt.sign(
      {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      process.env.JWT_SECRET
    );
    res.status(200).json({
      msg: "Sign-In Successful",
      token,
      userId: user._id,
      user: {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  } catch (error) {
    // Handle Zod Validation Errors
    if (error.errors) {
      return res.status(400).json({ errors: error.errors });
    }

    res.status(500).json({ message: error.message });
  }
});

// changePassword route
router.put("/changePassword", authMiddleware, async (req, res) => {
  try {
    // Parse request body with Zod validation
    const { currentPassword, newPassword } = changePasswordSchema.parse(
      req.body
    );

    // Find the user by ID
    const user = await User.findById(req.user);
    if (!user) {
      return res.status(404).json({
        msg: "User not found",
      });
    }

    // Verify current password
    const matchedPassword = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!matchedPassword) {
      return res.status(400).json({
        msg: "Incorrect current password",
      });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update the new password
    user.password = hashedPassword;
    await user.save();

    // Send success response
    res.status(200).json({
      msg: "Password successfully updated!",
    });
  } catch (error) {
    // Handle Zod validation errors
    if (error.errors) {
      return res.status(400).json({ errors: error.errors });
    }

    // Handle server errors
    res.status(500).json({ message: error.message });
  }
});

export default router;
