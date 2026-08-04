import { MongoClient } from 'mongodb';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// ESM workaround for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, "config.env") });

if (!process.env.ATLAS_URI) {
  console.error("ERROR: ATLAS_URI is not defined in config.env");
  process.exit(1);
}

const client = new MongoClient(process.env.ATLAS_URI);

let db;

export async function connectToDatabase() {
  if (db) return db;
  try {
    await client.connect();
    db = client.db("livepdx");
    // Verify connection by pinging the database
    await db.command({ ping: 1 });
    console.log("Successfully connected to MongoDB");
    return db;
  } catch (e) {
    console.error("Failed to connect to MongoDB", e);
    throw e;
  }
}
