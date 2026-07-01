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
import propertyRouter from "./routes/propertyRouter.js";
import transportRouter from "./routes/transportRoutes.js";
import adminTransportRoutes from "./routes/adminTransportRoutes.js";
import searchRoutes from "./routes/searchRoutes.js";
import path from "path";
import { fileURLToPath } from "url";


dotenv.config();
connectDb();

const app = express();

app.use(cors());
app.use(express.json());

// Health check route
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", message: "Server is running" });
});

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
app.use("/api/review", reviewRoutes);
app.use("/api/properties", propertyRouter);
app.use("/api/property/search", searchRoutes);
app.use("/api/transport", transportRouter);
app.use("/api/admin/transport", adminTransportRoutes);

// /api/auth/sendOtp  #
// /api/auth/verifyOtp #
// /api/auth/resendOtp #

// /api/profile #
// /api/profile/update #
// /api/profile/:userId #
// /api/profile/account-type #

// /api/verification/identity #
// /api/verification/property #

// /api/admin/auth/register #
// /api/admin/auth/login #

// /api/admin/verify/identity #
// /api/admin/verify/identity/:id #
// /api/admin/verify/identity/:id/approve #
// /api/admin/verify/identity/:id/reject #

// /api/admin/verify/property #
// /api/admin/verify/property/:id #
// /api/admin/verify/property/:id/approve #
// /api/admin/verify/property/:id/reject #

// /api/review/create 
// /api/review/getall
// /api/review/getone/:id
// /api/review/property/:propertyId

// /api/properties/create
// /api/properties/get
// /api/properties/details/:propertyId
// /api/properties/getbyid/:id

// /api/transport
// /api/transport/nearby?latitude=&longitude=&radius=
// /api/transport/:hubId

// /api/admin/transport/dashboard
// /api/admin/transport                 GET (paginated) | POST (create)
// /api/admin/transport/:hubId          GET | PUT | DELETE
// /api/admin/transport/:hubId/status   PATCH




















// Error Middleware (must be last)
app.use(errorHandler);



const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
