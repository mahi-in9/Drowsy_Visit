import mongoose from "mongoose";

export async function connectDB() {
  const mongoURI = process.env.MONGO_URI;
  if (!mongoURI) new Error("mongo uri is not exist in environmental variables");
  try {
    const connect = mongoose.connect(mongoURI);
  } catch (error) {
    process.exit(1);
    console.log(error.message);
  }
}
