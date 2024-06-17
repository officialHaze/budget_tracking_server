import Expense from "../models/Expense";
import FileSaver from "./FileSaver";
import { IncomeAPI as Income, Outstanding } from "./Income";
import Parser from "./Parser";
import Workbook from "./Workbook";

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

  private static calculateTotaExpenses(expenses: number[]) {
    return expenses.reduce((total, amt) => {
      return total + amt;
    });
  }

  public static async getExpensesFor(year: number, month: number) {
    try {
      const expenses = await Expense.find(
        { year, month },
        { __v: false, updatedAt: false }
      ).lean();

      const expenseGroupsByMonth = ExpenseGroup.createGroupByMonth(expenses);

      const expenseAmts = expenses.map((expense) => expense.expense_amount);

      const totalExpense = this.calculateTotaExpenses(expenseAmts);

      // Parse the json data into a xl sheet
      const wb = new Workbook();
      expenseGroupsByMonth.forEach((groupObj) => {
        // Serialize for excel viewing
        const serializedExpenses = groupObj.expenses.map((expenseRec) => {
          return {
            "Expense Amount": expenseRec.expense_amount,
            "Paid to": expenseRec.paid_to,
            "Paid on": expenseRec.createdAt,
          };
        });

        // Create an excel sheet
        const ws = Parser.jsonToExcel(serializedExpenses);
        // Append the ws to the workbook
        wb.appendSheet(ws, groupObj.month);
      });

      // Save the wb
      const filename = `${Date.now()}_expense_report.xlsx`;
      FileSaver.saveExcel(wb.getWbInstance(), filename);

      return {
        expenses: expenseGroupsByMonth,
        totalExpense,
        xlUniqueFilename: filename,
      };
    } catch (error) {
      throw error;
    }
  }

  public static async getExpensesForYear(year: number) {
    try {
      const expenses = await Expense.find(
        { year },
        { __v: false, updatedAt: false }
      ).lean();

      const expenseAmts = expenses.map((expense) => expense.expense_amount);

      const totalExpense = this.calculateTotaExpenses(expenseAmts);

      return { expenses, totalExpense };
    } catch (error) {
      throw error;
    }
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
  private static capAmount = 5000;
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
      const outstanding = await Outstanding.getOutstandingFor(year, month);

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

class ExpenseGroup {
  public static createGroupByMonth(expenses: any[]) {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    let uniqueMonths: number[] = [];
    let groups: { month: string; expenses: any[] }[] = [];

    expenses.forEach((expenseRec, idx) => {
      if (!uniqueMonths.includes(expenseRec.month))
        uniqueMonths.push(expenseRec.month);

      const idxOfUniqueMonth = uniqueMonths.indexOf(expenseRec.month);

      if (!groups[idxOfUniqueMonth]) {
        const group: { month: string; expenses: any[] } = {
          month: months[expenseRec.month - 1],
          expenses: [expenseRec],
        };
        groups.push(group);
      } else {
        const group = groups[idxOfUniqueMonth];
        const expenses = group.expenses;
        expenses.push(expenseRec);

        const updatedGroup: { month: string; expenses: any[] } = {
          ...group,
          expenses: [...expenses],
        };
        groups[idxOfUniqueMonth] = updatedGroup;
      }
    });

    return groups;
  }
}
