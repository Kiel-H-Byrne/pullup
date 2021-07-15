const url = require('url')
// Import the MongoDB driver
import { Db, MongoClient } from "mongodb";

// Define our connection string. Info on where to get this will be described below. In a real world application you'd want to get this string from a key vault like AWS Key Management, but for brevity, we'll hardcode it in our serverless function here.

// Once we connect to the database once, we'll store that connection and reuse it so that we don't have to connect to the database on every request.
let cachedDb: Db = null as any;

export async function connectToDatabase() {
  if (cachedDb) {
    return cachedDb;
  }

  // Connect to our MongoDB database hosted on MongoDB Atlas
  const client = await MongoClient.connect(process.env.MONGODB_URI!, {
    // @ts-ignore
    useNewUrlParser: true,
    useUnifiedTopology: true,
    // maxIdleTimeMS: 10000,
    // serverSelectionTimeoutMS: 10000,
    // socketTimeoutMS: 20000
  });

  // Create new db instance; Specify which database we want to use is optional
  const db = await client.db(url.parse(process.env.MONGODB_URI).pathname.substr(1))

  cachedDb = db;
  return db;
}