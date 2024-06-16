import express, { Express } from "express";
import incomeRouteController from "./routes/incomeRelated/income";
import newExpense from "./routes/expenseRelated/newExpense";
import savings from "./routes/savingsRelated/savings";
import addMoney from "./routes/addMoney";
import getExpenseReport from "./routes/expenseRelated/getExpenseReport";

export default class RouteInitializer {
  public static init(app: Express) {
    app.use("/api/income", incomeRouteController);
    app.use("/api/new_expense", newExpense);
    app.use("/api/savings", savings);
    app.use("/api/add_money", addMoney);
    app.use("/api/report/expenses", getExpenseReport);
  }
}
