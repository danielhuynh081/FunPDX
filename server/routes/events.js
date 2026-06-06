import express from 'express';
import { connectToDatabase } from '../connect.js';

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const db = await connectToDatabase();
    const collection = db.collection("events");
    const events = await collection.find({}).toArray();
    res.json(events);
  } catch (e) {
    res.status(500).json({ error: "Failed to fetch events" });
  }
});

export default router;
