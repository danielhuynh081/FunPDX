import express from "express";
import { connectToDatabase } from "../connect.js";
import { ObjectId } from "mongodb";

const router = express.Router();


function validateEvent(event) {
  const forbiddenKeywords = ["spam", "fake", "scam", "offensiveword1"]; // Example keywords
  const content = `${event.name} ${event.description}`.toLowerCase();
  
  if (forbiddenKeywords.some(keyword => content.includes(keyword))) {
    return "Content contains forbidden keywords.";
  }

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
    
    // Auto-archive expired events
    const today = new Date().toISOString().split('T')[0];
    await db.collection("events").deleteMany({ date: { $lt: today } });

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
    if (!newEvent.createdBy) {
      newEvent.createdBy = 'admin'; // Manual admin creations
    }

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

// Update an event
router.put("/:id", async (req, res) => {
  try {
    const db = await connectToDatabase();
    const updatedEvent = req.body;
    const eventId = new ObjectId(req.params.id);
    
    // Authorization check
    const existingEvent = await db.collection("events").findOne({ _id: eventId });
    if (!existingEvent) {
      return res.status(404).json({ error: "Event not found" });
    }

    const user = updatedEvent.requester; // Expected from frontend
    if (user?.role !== 'admin' && existingEvent.createdBy !== user?.username) {
      return res.status(403).json({ error: "Unauthorized to edit this event" });
    }

    delete updatedEvent.requester;
    delete updatedEvent._id;

    const error = validateEvent(updatedEvent);
    if (error) {
      return res.status(400).json({ error });
    }

    const result = await db.collection("events").updateOne(
      { _id: eventId },
      { $set: updatedEvent }
    );

    res.json({ _id: req.params.id, ...updatedEvent });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to update event" });
  }
});

// Delete an event
router.delete("/:id", async (req, res) => {
  try {
    const db = await connectToDatabase();
    const eventId = new ObjectId(req.params.id);

    // Authorization check (need user info)
    const requesterUsername = req.query.username;
    const requesterRole = req.query.role;

    const existingEvent = await db.collection("events").findOne({ _id: eventId });
    if (!existingEvent) {
      return res.status(404).json({ error: "Event not found" });
    }

    if (requesterRole !== 'admin' && existingEvent.createdBy !== requesterUsername) {
      return res.status(403).json({ error: "Unauthorized to delete this event" });
    }

    const result = await db.collection("events").deleteOne({
      _id: eventId,
    });

    res.json({ message: "Event deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete event" });
  }
});

// Check for duplicate event
router.post("/check-duplicate", async (req, res) => {
  try {
    const db = await connectToDatabase();
    const { name, date, location } = req.body;

    const existingEvent = await db.collection("events").findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") },
      date: date,
      location: { $regex: new RegExp(`^${location}$`, "i") }
    });

    const existingSubmission = await db.collection("submissions").findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") },
      date: date,
      location: { $regex: new RegExp(`^${location}$`, "i") }
    });

    res.json({ duplicate: !!(existingEvent || existingSubmission) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to check for duplicates" });
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

// Approve a submission
router.post("/submissions/:id/approve", async (req, res) => {
  try {
    const db = await connectToDatabase();
    const submissionId = new ObjectId(req.params.id);

    const submission = await db.collection("submissions").findOne({ _id: submissionId });
    if (!submission) {
      return res.status(404).json({ error: "Submission not found" });
    }

    // Move to events collection
    const newEvent = { ...submission };
    delete newEvent._id;
    delete newEvent.status;
    delete newEvent.submittedAt;
    newEvent.approvedAt = new Date();

    const result = await db.collection("events").insertOne(newEvent);
    await db.collection("submissions").deleteOne({ _id: submissionId });

    res.json({ message: "Event approved", event: { ...newEvent, _id: result.insertedId } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to approve submission" });
  }
});

// Reject/Delete a submission
router.delete("/submissions/:id", async (req, res) => {
  try {
    const db = await connectToDatabase();
    const result = await db.collection("submissions").deleteOne({
      _id: new ObjectId(req.params.id),
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Submission not found" });
    }

    res.json({ message: "Submission rejected/deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete submission" });
  }
});

export default router;