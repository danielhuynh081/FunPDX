import express from 'express';
import cors from 'cors';
import eventsRouter from './routes/events.js';
import { connectToDatabase } from './connect.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/events", eventsRouter);

// Initialize DB connection
connectToDatabase().catch(err => {
  console.error("Critical error during initial database connection:", err);
});

app.listen(3001, () => {
  console.log("Server running on http://localhost:3001");
});
