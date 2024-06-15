import express, { Express } from "express";
import incomeRouteController from "./routes/incomeRelated/income";
import newExpense from "./routes/expenseRelated/newExpense";

export default class RouteInitializer {
  app: Express;

  constructor(app: Express) {
    this.app = app;
  }

  public init() {
    this.app.use("/api/income", incomeRouteController);
    this.app.use("/api/new_expense", newExpense);
  }
}
