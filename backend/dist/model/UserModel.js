import { Schema, model } from "mongoose";
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
    stack: {
        type: String,
    },
    password: {
        type: String,
        required: [true, "Please enter your password"]
    },
});
export const user_model = model("users", userSchema);
