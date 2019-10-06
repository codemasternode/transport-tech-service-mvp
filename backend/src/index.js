import express from "express";
import mongodbConnection from "./config/db";
import roadRoutes from "./routes/road";
import webStatsRoutes from "./routes/websiteStats";
import contactRoutes from './routes/contact'
import mailer from "./config/mailer";
import dotenv from "dotenv/config";

const PORT = process.env.PORT || 5000,
  MONGO_DB_URL =
    process.env.MONGO_DB_URL ||
    `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@localhost:27018,localhost:27019,localhost:27017/transporttechservice?replicaSet=rs0`,
  app = express();
mongodbConnection(MONGO_DB_URL);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/api/distance", roadRoutes());
app.use("/api/webStatsRoutes", webStatsRoutes());
app.use("/api/contact", contactRoutes())

const server = app.listen(PORT, () => {
  console.log(`Application is running on port ${PORT}`);
});

process.on("exit", () => {
  server.close();
});

export default app;
