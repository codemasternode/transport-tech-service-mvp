import express from "express";
import mongodbConnection from "./config/db";
import companiesRoutes from "./routes/companies";
import vehiclesRoutes from "./routes/vehicles";
import redisClient from "./config/redis";

const PORT = process.env.PORT || 5000,
  MONGO_DB_URL =
    process.env.MONGO_DB_URL ||
    "mongodb://localhost:27017/transporttechservice",
  app = express(),
  Router = express.Router();

mongodbConnection(MONGO_DB_URL);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/api/company", companiesRoutes(Router));
app.use("/api/vehicle", vehiclesRoutes(Router));

app.listen(PORT, () => {
  console.log(`Application is running on port ${PORT}`);
});
