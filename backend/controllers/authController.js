import jwt from "jsonwebtoken";
import User from "../models/user";
import bcrypt from "bcrypt";

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const isExist = await User.findOne({ email });
    if (isExist)
      res.status(200).json({ success: false, message: "Invalid credentials" });
    const hashPassword = bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashPassword });
    res
      .send(201)
      .json({ success: true, message: "user created successfully", name });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error });
  }
};

export const login = async (req, res) => {
  try {
    // const
  } catch (error) {}
};
