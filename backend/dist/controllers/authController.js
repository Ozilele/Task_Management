import bcrypt from "bcryptjs";
import { user_model as UserModel } from "../model/UserModel.js";
import { signJWT } from "../config/jwt.js";
export const registerUser = async (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const stack = req.body.stack;
    if (!name || !email || !password) {
        console.log(stack);
        return res.status(400).json({
            message: "Please add all the fields",
        });
    }
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
        return res.status(400).json({
            message: "User of this email already exists"
        });
    }
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);
    // Create a new user in db
    const user = await UserModel.create({
        name,
        email,
        stack: stack ? stack : null,
        password: hashedPassword
    });
    if (user) {
        return res.status(201).json({
            id: user._id,
            name: user.name,
            email: user.email
        });
    }
    else {
        return res.status(400).json({
            message: "Invalid user's data"
        });
    }
};
export const loginUser = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    if (!email || !password)
        return res.status(400).json({ message: "Email and password are required to login" });
    const user = await UserModel.findOne({ email });
    if (!user) {
        return res.status(401).json({
            message: "User does not exist",
        });
    }
    // Comparing passwords
    const arePasswordsMatched = bcrypt.compareSync(password, user.password);
    const userPayload = {
        userId: (user._id).toString(),
        email: user.email
    };
    if (arePasswordsMatched) {
        const accessToken = signJWT(userPayload, {
            expiresIn: "1d",
        });
        const accessTokenCookieOptions = {
            maxAge: 90000000,
            domain: "localhost",
            httpOnly: false,
            secure: true,
            sameSite: "strict",
        };
        res.cookie("jwt", accessToken, accessTokenCookieOptions);
        res.status(200).json({
            accessToken,
            userId: user._id.toString()
        });
    }
    else {
        res.sendStatus(401);
    }
};
