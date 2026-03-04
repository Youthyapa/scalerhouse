// lib/db.ts
// MongoDB connection singleton — reuses connection across hot reloads in dev

import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error(
        '❌ MONGODB_URI is not defined. Please add it to your .env.local file.'
    );
}

// Global cache to avoid reconnecting on every API call in dev mode
let cached = (global as any).mongoose as {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
};

if (!cached) {
    cached = (global as any).mongoose = { conn: null, promise: null };
}

export async function connectDB(): Promise<typeof mongoose> {
    if (cached.conn) return cached.conn;

    if (!cached.promise) {
        cached.promise = mongoose
            .connect(MONGODB_URI as string, {
                bufferCommands: false,
                serverSelectionTimeoutMS: 5000,  // fail fast if Atlas is unreachable
                socketTimeoutMS: 45000,
                maxPoolSize: 10,                 // connection pool for production traffic
            })
            .catch((err) => {
                // Reset promise so the next request can retry the connection
                cached.promise = null;
                throw err;
            });
    }

    try {
        cached.conn = await cached.promise;
    } catch (err: any) {
        throw new Error(`❌ MongoDB connection failed: ${err.message}`);
    }

    return cached.conn;
}
