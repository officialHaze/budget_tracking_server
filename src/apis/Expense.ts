import Expense from "../models/Expense";
import { IncomeAPI as Income } from "./Income";

export class ExpenseAPI {
  year: number;
  month: number;

  paidTo: string;
  reason?: string;

  constructor(year: number, month: number, paidTo: string, reason?: string) {
    this.year = year;
    this.month = month;
    this.paidTo = paidTo;
    this.reason = reason;
  }

  public async new(expenseAmount: number, warnMe?: boolean) {
    try {
      if (warnMe) {
        const warning = await ExpenseWarning.checkForWarning(
          expenseAmount,
          this.year,
          this.month
        );
        if (warning) return warning;
      }

      // Deduct the expense from the income of the provided month for the provided year
      const income = new Income(this.year, this.month);
      await income.deduct(expenseAmount);

      // Create a new expense record
      console.log("*** Creating new Expense record ***");
      const newExpense = new Expense({
        year: this.year,
        month: this.month,
        expense_amount: expenseAmount,
        paid_to: this.paidTo,
        reason: this.reason,
      });
      const savedExpense = await newExpense.save();
      console.log(savedExpense);
    } catch (err) {
      throw err;
    }
  }
}

class ExpenseWarning {
  private static capAmount = 5000;
  private static capPercentYellow = 70;
  private static capPercentRed = 90;

  private static warningSeverity = {
    moderate: "Be careful with your expense please!",
    high: "You are burning up way too much money dawg!",
    severe: "Are you crazy! That's it I am blocking your account!",
  };

  public static async checkForWarning(
    expense: number,
    year: number,
    month: number
  ) {
    try {
      const outstanding = await Income.getOutstandingFor(year, month);

      let outStandingAfterExpense = outstanding - expense;
      if (outStandingAfterExpense <= 0) return this.warningSeverity.severe;

      outStandingAfterExpense =
        (this.capAmount / outStandingAfterExpense) * 100;

      if (outStandingAfterExpense >= this.capPercentRed)
        return this.warningSeverity.high;
      if (outStandingAfterExpense >= this.capPercentYellow)
        return this.warningSeverity.moderate;

      return null;
    } catch (error) {
      throw error;
    }
  }
}
