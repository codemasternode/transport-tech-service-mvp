import express from "express";
import mongodbConnection from "./config/db";
import companiesRoutes from "./routes/companies";
import vehiclesRoutes from "./routes/vehicles";
import staticCostsRoutes from "./routes/staticCosts";
import workersRoutes from "./routes/workers";
import mailer from "./config/mailer";
import dotenv from "dotenv/config";
import redisClient from "./config/redis";

const PORT = process.env.PORT || 5000,
  MONGO_DB_URL =
    process.env.MONGO_DB_URL ||
    "mongodb://localhost:27017/transporttechservice",
  app = express();
mongodbConnection(MONGO_DB_URL);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/api/vehicle", vehiclesRoutes());
app.use("/api/static-costs", staticCostsRoutes());
app.use("/api/company", companiesRoutes());
app.use("/api/worker", workersRoutes());

app.listen(PORT, () => {
  console.log(`Application is running on port ${PORT}`);
});
