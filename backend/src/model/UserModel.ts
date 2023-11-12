import { Schema, model } from "mongoose";
import { User, UserStack } from "../types/types.js";

const userSchema = new Schema<User>({
  name: {
    type: String,
    required: [true, "Please add a name"]
  },
  email: {
    type: String,
    required: [true, "Please add an email"],
    lowercase: true,
    unique: true,
  },
  stack: {
    type: String,
  },
  password: {
    type: String,
    required: [true, "Please enter your password"]
  },
});

export const user_model = model<User>("users", userSchema);