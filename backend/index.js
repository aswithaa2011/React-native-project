import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDb from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import hostelRouter from "./routes/hostelRouter.js";




dotenv.config();
connectDb();

const app = express();

app.use(cors());
app.use(express.json());




app.use("/api/auth", authRoutes);

app.use("/api/hostels", hostelRouter);


const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
