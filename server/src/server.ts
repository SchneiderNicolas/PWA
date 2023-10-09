import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import bodyParser from "body-parser";
import cors from "cors";
import router from "./routes";
import { errorHandler } from "./middlewares/errorHandler";
import { notFoundHandler } from "./middlewares/notFoundHandler";
import discussionSockets from "./sockets/discussion";

require("dotenv").config();

if (process.env.NODE_ENV === "production") {
  process.env.DATABASE_URL = `postgresql://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.DB_HOST_PROD}:${process.env.DB_PORT}/${process.env.POSTGRES_DB}?schema=public`;
} else {
  process.env.DATABASE_URL = `postgresql://${process.env.POSTGRES_USER}:${process.env.POSTGRES_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.POSTGRES_DB}?schema=public`;
}

const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT || 8080;

export const io = new Server(httpServer, {
  cors: {
    origin:
      process.env.NODE_ENV === "production"
        ? "https://pwa.nicolas-schneider.fr"
        : "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId) {
    socket.join(userId.toString());
  }

  discussionSockets(socket, io);
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

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
app.use("/", router); // Your API routes

// 404 Handler
app.use(notFoundHandler);

// Global Error Handler
app.use(errorHandler);

httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
