import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDb from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import userProfileRoutes from "./routes/userProfileRoutes.js";
import verificationRoutes from "./routes/verificationRoutes.js";
import adminVerificationRoutes from "./routes/adminVerificationRoutes.js";
import { errorHandler } from "./middlewares/errorMiddleware.js";


dotenv.config();
connectDb();

const app = express();

app.use(cors());
app.use(express.json());


app.use("/api/auth", authRoutes);
app.use("/api/profile", userProfileRoutes);
app.use("/api/verification", verificationRoutes);
app.use("/api/admin/verification", adminVerificationRoutes);

// Error Middleware
app.use(errorHandler);


const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

//http://localhost:5000/api/auth/sendOtp