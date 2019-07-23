import express from "express";
import mongodbConnection from './config/db'

const PORT = process.env.PORT || 5000,
MONGO_DB_URL = process.env.MONGO_DB_URL || "mongodb://localhost:27017/transporttechservice",
app = express();
Router = express.Router()

mongodbConnection(MONGO_DB_URL)



app.listen(PORT, () => {
  console.log(`Application is running on port ${PORT}`);
});
