import express, { Express } from "express";

export default class ExpressConfig {
  public static init(app: Express) {
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());
  }
}
