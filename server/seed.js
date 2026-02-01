import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "./db.js";
import User from "./models/User.js";

dotenv.config();

const seedUsers = async () => {
    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email: "admin@example.com" });
        if (existingUser) {
            console.log("User already exists");
            return;
        }

        // Create a new user
        const newUser = new User({
            name: "Admin User",
            email: "admin@example.com",
            password: "password123", // This will be hashed automatically
            mobile: "1234567890",
            status: "Active",
        });

        await newUser.save();
        console.log("✓ Test user created successfully");
        console.log("Email: admin@example.com");
        console.log("Password: password123");
    } catch (error) {
        console.error("Error creating user:", error.message);
    }
};

const runSeed = async () => {
    try {
        await connectDB();
        await seedUsers();
        console.log("Seed completed successfully");
        process.exit(0);
    } catch (error) {
        console.error("Seed error:", error.message);
        process.exit(1);
    } finally {
        await mongoose.connection.close();
    }
};

runSeed();
