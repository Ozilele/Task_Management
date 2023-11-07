import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.js";
const app = express();
app.use(express.json());
app.use(cors());
mongoose.connect("mongodb://localhost/management");
app.use("/auth", authRoutes);
app.listen(4444, () => {
    console.log("Połączono z serwerkiem");
});
