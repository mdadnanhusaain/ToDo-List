import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";

import taskRoutes from "./routes/taskRoutes.js";

dotenv.config();

const app = express();

// MongoDB Connection
async function main() {
  await mongoose.connect(process.env.MONGO_URI);
}

main()
  .then((res) => {
    console.log("Successfully connected to Database\n");
  })
  .catch((err) => {
    console.log(err);
  });

app.use(express.json());
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN,
  })
);

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/tasks", taskRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server is listening to http://localhost:${process.env.PORT} \n`);
});
