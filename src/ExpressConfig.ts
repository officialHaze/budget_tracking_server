import express, { Express } from "express";

export default class ExpressConfig {
  app: Express;

  constructor(app: Express) {
    this.app = app;
  }

  public init() {
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.json());
  }
}
