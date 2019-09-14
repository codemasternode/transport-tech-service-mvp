import express from "express";
import mongodbConnection from "./config/db";
import companiesRoutes from "./routes/companies";
import vehiclesRoutes from "./routes/vehicles";
import staticCostsRoutes from "./routes/staticCosts";
import workersRoutes from "./routes/workers";
import paymentsRoutes from "./routes/payments";
import roadRoutes from "./routes/road";
import companyBasesRoutes from "./routes/companyBase";
import usersRoutes from "./routes/users";
import mailer from "./config/mailer";
import dotenv from "dotenv/config";
import redisClient from "./config/redis";

const PORT = process.env.PORT || 5000,
  MONGO_DB_URL =
    process.env.MONGO_DB_URL ||
    `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@localhost:27018,localhost:27019,localhost:27017/transporttechservice?replicaSet=rs0`,
  app = express();
mongodbConnection(MONGO_DB_URL);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/api/company-bases", companyBasesRoutes());
app.use("/api/vehicles", vehiclesRoutes());
app.use("/api/static-costs", staticCostsRoutes());
app.use("/api/company", companiesRoutes());
app.use("/api/workers", workersRoutes());
app.use("/api/users", usersRoutes());
app.use("/api/payments", paymentsRoutes());
app.use("/api/distance", roadRoutes());

const server = app.listen(PORT, () => {
  console.log(`Application is running on port ${PORT}`);
});

process.on("exit", () => {
  server.close();
});

export default app;
