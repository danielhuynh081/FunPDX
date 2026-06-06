import express from 'express';
import cors from 'cors';
import eventsRouter from './routes/events.js';

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/events", eventsRouter);

app.listen(3001, () => {
  console.log("Server running on http://localhost:3001");
});
