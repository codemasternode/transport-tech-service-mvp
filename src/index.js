import express from "express";
import cors from "cors";
import mongodbConnection from "./config/db";
import roadRoutes from "./routes/road";
import webStatsRoutes from "./routes/websiteStats";
import path from 'path'
import contactRoutes from './routes/contact'
import companyRoutes from './routes/company'
import invitesRoutes from './routes/invites'
import authRoutes from './routes/auth'
import companyDashboardRoutes from './routes/companyDashboard'
import fileUpload from 'express-fileupload'
import mailer from "./config/mailer";
import dotenv from "dotenv/config";
import cookieParser from 'cookie-parser'

let PORT = process.env.PORT || 5000,
  MONGO_DB_URL = process.env.MONGO_DB_URL
const app = express();
app.use(express.static(path.join(__dirname, '../client/build')));
if (process.env.MODE === "DEV") {
  PORT = 5000
  MONGO_DB_URL = `mongodb://localhost:27017.localhost:27018,localhost:27019/tt111`
  app.use(cors({ credentials: true, origin: ['http://localhost:3000', 'http://localhost:5000'] }));
} else {
  app.use(cors({ credentials: true, origin: ['http://localhost:5000', 'http://localhost:3000'] }));
}

mongodbConnection(MONGO_DB_URL);
app.use(fileUpload({
  limits: { fileSize: 50 * 1024 * 1024 },
}));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser())

app.use("/api/distance", roadRoutes());
app.use("/api/web-stats", webStatsRoutes());
app.use("/api/contact", contactRoutes())
app.use("/api/company", companyRoutes())
app.use("/api/invites", invitesRoutes())
app.use("/api/company-dashboard", companyDashboardRoutes())
app.use("/api/auth", authRoutes())


app.get('*', (req, res) => {
  console.log(path.join(__dirname, '../client/build/index.html'))
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

const server = app.listen(PORT, () => {
  console.log(`Application is running on port ${PORT}`);
});

process.on("exit", () => {
  server.close();
});


export default app;
