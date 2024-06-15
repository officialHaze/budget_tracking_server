import express, { Express } from "express";
import incomeRouteController from "./routes/incomeRelated/income";
import newExpense from "./routes/expenseRelated/newExpense";
import depositSavings from "./routes/savingsRelated/depositSavings";
import addMoney from "./routes/addMoney";

export default class RouteInitializer {
  public static init(app: Express) {
    app.use("/api/income", incomeRouteController);
    app.use("/api/new_expense", newExpense);
    app.use("/api/savings", depositSavings);
    app.use("/api/add_money", addMoney);
  }
}
