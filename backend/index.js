import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDb from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import userProfileRoutes from "./routes/userProfileRoutes.js";
import verificationRoutes from "./routes/verificationRoutes.js";
import adminVerificationRoutes from "./routes/adminVerificationRoutes.js";
import adminAuthRoutes from "./routes/adminAuthRoutes.js";
import { errorHandler } from "./middlewares/errorMiddleware.js";
import reviewRoutes from "./routes/reviewRoutes.js"
import hostelRouter from "./routes/hostelRouter.js";
import path from "path";
import { fileURLToPath } from "url";




dotenv.config();
connectDb();

const app = express();

app.use(cors());
app.use(express.json());


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(
  "/uploads",
  express.static(
    path.join(__dirname, "uploads")
  )
);

app.use("/api/auth", authRoutes);
app.use("/api/profile", userProfileRoutes);
app.use("/api/verification", verificationRoutes);
app.use("/api/admin/auth", adminAuthRoutes);
app.use("/api/admin/verify", adminVerificationRoutes);


// /api/auth/sendOtp
// /api/auth/verifyOtp
// /api/auth/resendOtp

// /api/profile
// /api/profile/update
// /api/profile/:userId
// /api/profile/account-type

// /api/verification/identity
// /api/verification/hostel
  
// /api/admin/auth/register
// /api/admin/auth/login

// /api/admin/verify/identity
// /api/admin/verify/identity/:id
// /api/admin/verify/identity/:id/approve
// /api/admin/verify/identity/:id/reject

// /api/admin/verify/hostel
// /api/admin/verify/hostel/:id
// /api/admin/verify/hostel/:id/approve
// /api/admin/verify/hostel/:id/reject



// Error Middleware
app.use(errorHandler);
app.use("/api/review",reviewRoutes)

app.use("/api/hostels", hostelRouter);


const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
