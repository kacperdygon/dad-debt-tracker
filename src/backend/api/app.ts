import express from "express";
import cors from "cors";
import routes from "./routes";

import mongoose from 'mongoose'

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

if (!process.env.MONGODB_URI) {
  throw new Error("MongoDB URI not set");
}

await mongoose.connect(process.env.MONGODB_URI);

app.use("/api", routes);

export default app;