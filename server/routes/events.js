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

router.post("/", async (req, res) => {
  try {
    const db = await connectToDatabase();
    const collection = db.collection("events");
    const newEvent = req.body;
    // Enhanced validation
    const requiredFields = ['name', 'date', 'time', 'location', 'description', 'price', 'tags'];
    const missingFields = requiredFields.filter(field => !newEvent[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({ error: `Missing required fields: ${missingFields.join(', ')}` });
    }
    
    // Ensure tags is an array
    if (!Array.isArray(newEvent.tags)) {
      newEvent.tags = typeof newEvent.tags === 'string' ? [newEvent.tags] : [];
    }

    // Assign default placeholder if image is missing
    if (!newEvent.image) {
      newEvent.image = "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80&w=1000";
    }

    const result = await collection.insertOne(newEvent);
    res.status(201).json({ ...newEvent, _id: result.insertedId });
  } catch (e) {
    res.status(500).json({ error: "Failed to create event" });
  }
});

export default router;
