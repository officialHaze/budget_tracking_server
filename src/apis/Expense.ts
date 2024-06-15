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

      if (warnMe) {
        const warning = await ExpenseWarning.checkForWarning(
          expenseAmount,
          this.year,
          this.month
        );
        if (warning) return warning;
      }
    } catch (err) {
      throw err;
    }
  }
}

class ExpenseWarning {
  private static capAmount = 3000;
  private static moderateWarningPercent = 70;
  private static highWarningPercent = 90;

  private static warningSeverity = {
    moderate: {
      severity: "Moderate",
      message: "Be careful with your expenses please!",
    },
    high: {
      severity: "High",
      message: "You are burning up way too much money dawg!",
    },
    severe: {
      severity: "Severe",
      message: "Are you crazy! That's it I am blocking your account!",
    },
  };

  public static async checkForWarning(
    expense: number,
    year: number,
    month: number
  ) {
    try {
      const outstanding = await Income.getOutstandingFor(year, month);

      const outStandingAfterExpense = outstanding - expense;
      if (outStandingAfterExpense <= 0) return this.warningSeverity.severe;

      const outStandingPercent =
        (this.capAmount / outStandingAfterExpense) * 100;

      if (outStandingPercent >= this.highWarningPercent)
        return this.warningSeverity.high;
      if (outStandingPercent >= this.moderateWarningPercent)
        return this.warningSeverity.moderate;

      return null;
    } catch (error) {
      throw error;
    }
  }
}
