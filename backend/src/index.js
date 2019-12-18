import express from "express";
import cors from "cors";
import mongodbConnection from "./config/db";
import roadRoutes from "./routes/road";
import webStatsRoutes from "./routes/websiteStats";
import path from 'path'
import contactRoutes from './routes/contact'
import mailer from "./config/mailer";
import dotenv from "dotenv/config";

let PORT = process.env.PORT || 5000,
  MONGO_DB_URL =
    process.env.MONGO_DB_URL
if (process.env.mode === "DEV") {
  PORT = 5000
  MONGO_DB_URL = `mongodb://localhost:27017/tts`
}
console.log(process.env)

//`mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@localhost:27018,localhost:27019,localhost:27017/transporttechservice?replicaSet=rs0`,
const app = express();
mongodbConnection(MONGO_DB_URL);
app.use(express.static(path.join(__dirname, '../../client/build')));
app.use(cors({ credentials: true, origin: 'http://localhost:5000' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/api/distance", roadRoutes());
app.use("/api/webStatsRoutes", webStatsRoutes());
app.use("/api/contact", contactRoutes())
app.get('*', (req, res) => {
  console.log(path.join(__dirname, '../../client/build/index.html'))
  res.sendFile(path.join(__dirname, '../../client/build/index.html'));
});

const server = app.listen(PORT, () => {
  console.log(`Application is running on port ${PORT}`);
});

process.on("exit", () => {
  server.close();
});


export default app;
