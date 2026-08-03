import express from "express";
import { connectToDatabase } from "../connect.js";
import { ObjectId } from "mongodb";

const router = express.Router();


function validateEvent(event) {
  const requiredFields = [
    "name",
    "date",
    "time",
    "location",
    "description",
    "price",
    "tags",
    "type",
    "organizer",
  ];

  const missingFields = requiredFields.filter((field) => !event[field]);

  if (missingFields.length > 0) {
    return `Missing required fields: ${missingFields.join(", ")}`;
  }

  if (!Array.isArray(event.tags)) {
    event.tags = typeof event.tags === "string" ? [event.tags] : [];
  }

  if (!event.image) {
    event.image =
        "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&q=80&w=1000";
  }

  return null;
}


// Get approved events
router.get("/", async (req, res) => {
  try {
    const db = await connectToDatabase();
    const events = await db.collection("events").find({}).toArray();

    res.json(events);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Failed to fetch events",
    });
  }
});

// Create an approved event (Admin use)
router.post("/", async (req, res) => {
  try {
    const db = await connectToDatabase();

    const newEvent = req.body;

    const error = validateEvent(newEvent);
    if (error) {
      return res.status(400).json({ error });
    }

    newEvent.createdAt = new Date();

    const result = await db.collection("events").insertOne(newEvent);

    res.status(201).json({
      ...newEvent,
      _id: result.insertedId,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Failed to create event",
    });
  }
});

// Delete an event
router.delete("/:id", async (req, res) => {
  try {
    const db = await connectToDatabase();
    const result = await db.collection("events").deleteOne({
      _id: new ObjectId(req.params.id),
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Event not found" });
    }

    res.json({ message: "Event deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete event" });
  }
});

// Get submitted events awaiting approval
router.get("/submissions", async (req, res) => {
  try {
    const db = await connectToDatabase();
    const submissions = await db.collection("submissions").find({}).toArray();

    res.json(submissions);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Failed to fetch submissions",
    });
  }
});

// Submit an event for approval
router.post("/submissions", async (req, res) => {
  try {
    const db = await connectToDatabase();

    const submission = req.body;

    const error = validateEvent(submission);
    if (error) {
      return res.status(400).json({ error });
    }

    submission.status = "pending";
    submission.submittedAt = new Date();

    const result = await db
        .collection("submissions")
        .insertOne(submission);

    res.status(201).json({
      ...submission,
      _id: result.insertedId,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Failed to create submission",
    });
  }
});

export default router;