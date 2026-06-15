import mongoose from "mongoose";

const connectDb = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`Db connected ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1);
  }
};

export default connectDb;