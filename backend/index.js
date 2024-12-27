import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import userRouter from "./routes/userRoutes.js";
import favouriteRouter from "./routes/favouriteRoutes.js";

import cors from "cors";

// import cors from "cors";

dotenv.config();
const PORT = process.env.PORT || 3000;
const app = express();

// Middleware for JSON and URL-encoded requests
app.use((req, res, next) => {
  if (req.method === "DELETE") {
    req.headers["content-type"] = "application/x-www-form-urlencoded";
  }
  next();
});
app.use(express.json({ strict: false })); // Allows empty JSON bodies
app.use(express.urlencoded({ extended: true }));

app.use(cors()); // Enables CORS for all routes

connectDB();

// app.use("/api/v1/accounts", userRouter);
app.use("/api/v1/user", userRouter); // Mount user routes
app.use("/api/v1/favourite", favouriteRouter); // Mount favourite routes

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
