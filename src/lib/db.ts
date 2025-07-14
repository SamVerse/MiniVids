import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
    throw new Error(
        "Please define the MONGODB_URI environment variable inside .env.local"
    );
}

let cached = global.mongoose;
// This checks if the mongoose connection is already cached to avoid multiple connections
if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
} 

export async function connectToDatabase() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: true, // Disable mongoose's buffering of commands
            maxPoolSize: 10, // Maintain up to 10 socket connections
        };

        cached.promise = mongoose.connect(MONGODB_URI, opts);
        // Set the connection promise to the cached promise
    }

    try{
        cached.conn = await cached.promise;
    } catch (error) {
        cached.promise = null;
        throw new Error("Failed to connect to the database: " + error);
    }

    return cached.conn;
}


