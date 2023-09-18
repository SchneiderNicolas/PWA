import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import router from "./routes";
import { errorHandler } from "./middlewares/errorHandler";
import { notFoundHandler } from "./middlewares/notFoundHandler";

require("dotenv").config();

if (process.env.NODE_ENV === "production") {
  process.env.DATABASE_URL = `postgresql://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.DB_HOST_PROD}:${process.env.DB_PORT}/${process.env.POSTGRES_DB}?schema=public`;
} else {
  process.env.DATABASE_URL = `postgresql://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.POSTGRES_DB}?schema=public`;
}

const app = express();
const PORT = 8080;

// CORS settings
const corsOptions = {
  origin:
    process.env.NODE_ENV === "production"
      ? "https://pwa.nicolas-schneider.fr"
      : "http://localhost:3000",
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

app.use(bodyParser.json());

app.use("/", router);

// 404 Handler
app.use(notFoundHandler);

// Global Error Handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
