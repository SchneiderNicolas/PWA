import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import router from "./routes";
import { errorHandler } from "./middlewares/errorHandler";
import { notFoundHandler } from "./middlewares/notFoundHandler";

const app = express();
const PORT = 8080;

app.use(cors());
app.use(bodyParser.json());

app.use("/", router);

// 404 Handler
app.use(notFoundHandler);

// Global Error Handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
