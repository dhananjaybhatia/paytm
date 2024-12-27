// add to favourite
import express from "express";
import mongoose from "mongoose";
import authMiddleware from "../middleware/authMiddleware.js";
import { User, Favourite } from "../models/userSchema.js";

const router = express.Router();

router.post("/", authMiddleware, async (req, res) => {
  const { personId, notes } = req.body;
  const addedId = req.user._id; // Assume req.user is populated by authentication middleware

  try {
    // Check if the person exists in the User collection
    const personExist = await User.findById(personId);

    if (!personExist) {
      return res.status(404).json({
        msg: "User to be favourited does not exist",
      });
    }

    // Check if the favourite already exists
    const existingFavourite = await Favourite.findOne({ personId, addedId });

    if (existingFavourite) {
      return res.status(400).json({
        msg: "Person already exists in your favourites",
      });
    }

    // Add to favourites
    const favourite = new Favourite({ personId, addedId, notes });
    await favourite.save();

    res.status(200).json({
      msg: "Successfully added to favourites",
      favourite,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

//get all favourites
router.get("/allFavourite", authMiddleware, async (req, res) => {
  const addedId = req.user._id; // Populated by authentication middleware

  try {
    // Fetch favourites for the logged-in user
    const favourites = await Favourite.find({ addedId }).populate(
      "personId",
      "firstName lastName email"
    );

    // Sort the populated favourites in JavaScript
    favourites.sort((a, b) => {
      const nameA =
        `${a.personId.firstName} ${a.personId.lastName}`.toLowerCase();
      const nameB =
        `${b.personId.firstName} ${b.personId.lastName}`.toLowerCase();
      return nameA.localeCompare(nameB);
    });

    res.status(200).json({
      msg: "Favourites retrieved successfully",
      favourites,
    });
  } catch (error) {
    res
      .status(500)
      .json({ msg: "Internal server error", error: error.message });
  }
});

// delete favourite

router.delete("/delete", authMiddleware, async (req, res) => {
  const userId = req.user._id; // Authenticated user ID
  let { favouriteId } = req.query; // Extract from query

  try {
    // Ensure favouriteId is properly formatted
    if (!favouriteId) {
      return res.status(400).json({ error: "Favourite ID is required" });
    }

    // Force favouriteId to string and validate it
    favouriteId = String(favouriteId).trim();

    if (!mongoose.Types.ObjectId.isValid(favouriteId)) {
      return res.status(400).json({ error: "Invalid Favourite ID format" });
    }

    // Perform deletion
    const deletedDoc = await Favourite.findOneAndDelete({
      _id: new mongoose.Types.ObjectId(favouriteId),
      addedId: userId,
    });

    console.log("Deleted Document:", deletedDoc);

    if (!deletedDoc) {
      return res
        .status(404)
        .json({ error: "Favourite not found or not authorized to delete" });
    }

    res.status(200).json({
      message: "Favourite successfully deleted",
      deletedFavourite: deletedDoc,
    });
  } catch (error) {
    console.error("Error deleting favourite:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
