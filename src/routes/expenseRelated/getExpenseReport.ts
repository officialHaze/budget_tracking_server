import express, { NextFunction, Request, Response } from "express";
import { ExpenseAPI as Expense } from "../../apis/Expense";

const router = express.Router();

// Get expense report for a month and a year
router.get(
  "/month_and_year/:year/:month",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const year = req.params.year;
      const month = req.params.month;
      if (!year) throw { status: 400, error: "Year is required!" };
      if (!month) throw { status: 400, error: "Month is required" };

      const { expenses, totalExpense } = await Expense.getExpensesFor(
        parseInt(year),
        parseInt(month)
      );

      return res
        .status(200)
        .json({ message: "Success!", totalExpense, expenses });
    } catch (error) {
      console.error(error);
      return next(error);
    }
  }
);

// Get expense report for a year only
router.get(
  "/year/:year",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const year = req.params.year;
      if (!year) throw { status: 400, error: "Year is required!" };

      const { expenses, totalExpense } = await Expense.getExpensesForYear(
        parseInt(year)
      );

      return res
        .status(200)
        .json({ message: "Success!", totalExpense, expenses });
    } catch (error) {
      console.error(error);
      return next(error);
    }
  }
);

export default router;
