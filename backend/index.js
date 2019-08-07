import express from "express";
import mongodbConnection from "./config/db";
import companiesRoutes from "./routes/companies";
import vehiclesRoutes from "./routes/vehicles";
<<<<<<< HEAD
import mailer from './config/mailer'
=======
import staticCostsRoutes from "./routes/staticCosts";
import workersRoutes from "./routes/workers";
import mailer from "./config/mailer";
>>>>>>> 2254e59d472b618a201ca487775dbb412e6fcd17
import dotenv from "dotenv/config";
import redisClient from "./config/redis";

const PORT = process.env.PORT || 5000,
  MONGO_DB_URL =
    process.env.MONGO_DB_URL ||
    "mongodb://localhost:27017/transporttechservice",
<<<<<<< HEAD
  app = express(),
  Router = express.Router();
=======
  app = express();
>>>>>>> 2254e59d472b618a201ca487775dbb412e6fcd17
mongodbConnection(MONGO_DB_URL);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
<<<<<<< HEAD
app.use("/api/company", companiesRoutes(Router));
app.use("/api/vehicle", vehiclesRoutes(Router));
=======
app.use("/api/vehicle", vehiclesRoutes());
app.use("/api/static-costs", staticCostsRoutes());
app.use("/api/company", companiesRoutes());
app.use("/api/worker", workersRoutes());
>>>>>>> 2254e59d472b618a201ca487775dbb412e6fcd17

app.listen(PORT, () => {
  console.log(`Application is running on port ${PORT}`);
});
<<<<<<< HEAD
=======

export default app;
>>>>>>> 2254e59d472b618a201ca487775dbb412e6fcd17
