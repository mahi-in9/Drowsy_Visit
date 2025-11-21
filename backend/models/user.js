import mongoose from "mongoose";

const userSchema = new mongoose.schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, minLength: 8 },
    role: { type: String, enum: ["user", "admin"], def: "user" },
    createdAt: { type: Date.now() },
  },
  {
    timeStamp: true,
  }
);
const User = mongoose.model("User", userSchema);
export default User;
