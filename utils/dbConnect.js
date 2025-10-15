'use server';

import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
    console.log('MONGO_URI is not defined');
    throw new Error(
        'Please define the MONGO_URI environment variable inside .env.local'
    );
}

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const options = {
            serverSelectionTimeoutMS: 30000, // Increase timeout to 30 seconds
            socketTimeoutMS: 45000,
            family: 4, // Force IPv4 (often fixes Windows DNS issues)
        };

        cached.promise = mongoose
            .connect(MONGO_URI, options)
            .then((mongoose) => {
                return mongoose;
            });
    }
    cached.conn = await cached.promise;
    console.log('Connected to MongoDB successfully');
    return cached.conn;
}

export default dbConnect;
