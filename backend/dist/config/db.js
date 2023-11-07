import mongoose from "mongoose";
export let conn;
export const connectToDb = async () => {
    try {
        const connection = await mongoose.connect("asasasasasa");
        conn = connection;
        console.log("Połączono z bazą danych...");
    }
    catch (err) {
        console.log(err);
    }
};
