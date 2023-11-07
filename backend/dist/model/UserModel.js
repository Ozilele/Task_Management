import { Schema, model } from "mongoose";
import { UserStack } from "../types/types.js";
const userSchema = new Schema({
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
    stack: UserStack,
    password: {
        type: String,
        required: [true, "Please enter your password"]
    },
});
export const user_model = model("users", userSchema);
