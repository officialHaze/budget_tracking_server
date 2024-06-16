import { randomUUID } from "crypto";
import express from "express";
import { createServer as createHttpServer } from "http";
import mongoose from "mongoose";
import RouteErrorHandler from "./handlers/RouteErrorHandler";
import ExpressConfig from "./ExpressConfig";
import RouteInitializer from "./RouteInitializer";
import Authenticator from "./middlewares/Authenticator";
import env from "../env.json";

class Server {
  static app = express();
  static httpServer = createHttpServer(this.app);

  static PORT = env.PORT ?? 8000;

  static sessionId = randomUUID();

  private static listen() {
    this.httpServer.listen(this.PORT, () => {
      console.log(
        `[${this.sessionId}] HTTP Server started and listening on PORT: ${this.PORT}`
      );
      // Connect to mongo db cloud
      if (!env.MONGO_DB_URI)
        throw new Error("MongoDB connection string is missing!");
      mongoose
        .connect(env.MONGO_DB_URI)
        .then(() =>
          console.log(`[${this.sessionId}] Connected to MongoDB on cloud`)
        );
    });
  }

  public static start() {
    // Config
    ExpressConfig.init(this.app);

    // Listen on PORT
    this.listen();

    // Authenticator middleware
    this.app.use("/api/*", Authenticator.authenticate);

    // Routes
    RouteInitializer.init(this.app);

    // Global error handler for any error in the routes
    this.app.use(RouteErrorHandler.exec);
  }
}

Server.start();
