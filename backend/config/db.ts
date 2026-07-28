import dns from "node:dns";
import mongoose from "mongoose";

// Set custom DNS servers to fix querySrv ECONNREFUSED issues on Windows ISP DNS
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const connectDB = async () => {
    try {
        const mongoUri = process.env.MONGODB_URL;
        if (!mongoUri) {
            throw new Error("MongoDB connection URI is missing. Please set MONGODB_URL in your .env file.");
        }
        mongoose.connection.on("connected", () => {
            console.log('MongoDB connected');
        });
        await mongoose.connect(mongoUri);
    } catch (error: any) {
        console.error("MongoDB Connection Error:", error.message || error);
        process.exit(1);
    }
}

export default connectDB;