import express, { Express } from "express";
import CorsConfig from "./CorsConfig";
import cors from "cors";

export default class ExpressConfig {
  public static init(app: Express) {
    app.use(cors(CorsConfig.getOptions()));
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());
  }
}
