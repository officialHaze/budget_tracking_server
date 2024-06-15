import { randomUUID } from "crypto";
import "dotenv/config";
import express from "express";
import { createServer as createHttpServer } from "http";
import mongoose from "mongoose";

class Server {
  static app = express();
  static httpServer = createHttpServer();

  static PORT = process.env.PORT ?? 8000;

  static sessionId = randomUUID();

  public static start() {
    // Listen on PORT
    this.httpServer.listen(this.PORT, () => {
      console.log(
        `[${this.sessionId}] HTTP Server started and listening on PORT: ${this.PORT}`
      );
      // Connect to mongo db cloud
      if (!process.env.MONGO_DB_URI)
        throw new Error("MongoDB connection string is missing!");
      mongoose
        .connect(process.env.MONGO_DB_URI)
        .then(() =>
          console.log(`[${this.sessionId}] Connected to MongoDB on cloud`)
        );
    });

    // Routes
  }
}

Server.start();
