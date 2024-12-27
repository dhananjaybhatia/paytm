import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Please provide a username"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please provide a valid email address",
      ], // Regular expression for email validation
    },
    password: {
      type: String,
      required: [true, "Please provide a password"],
      minlength: [6, "Password must be at least 6 characters long"],
    },
    firstName: {
      type: String,
      required: [true, "Please provide a firstname"],
      trim: true,
      minlength: [3, "Firstname must be at least 3 characters long"],
      maxlength: [30, "Firstname cannot exceed 30 characters"],
    },
    lastName: {
      type: String,
      required: [true, "Please provide a lastname"],
      trim: true,
      minlength: [3, "Lastname must be at least 3 characters long"],
      maxlength: [30, "Lastname cannot exceed 30 characters"],
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

const User = mongoose.model("User", userSchema);

const favouriteSchema = new mongoose.Schema(
  {
    personId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    addedId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [120, "Notes cannot exceed 120 characters"],
    },
    createdAt: {
      type: Date,
      default: Date.now, // Automatically set the creation date
    },
  },
  {
    timestamps: false, // Explicitly disable timestamps if not needed
  }
);
// Prevent duplicate favorites (same person for the same user)
favouriteSchema.index({ personId: 1, addedBy: 1 }, { unique: true });

const Favourite = mongoose.model("Favourite", favouriteSchema);

export { User, Favourite };
