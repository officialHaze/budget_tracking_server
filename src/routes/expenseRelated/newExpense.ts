import express, { NextFunction, Request, Response } from "express";
import { ExpenseAPI as Expense } from "../../apis/Expense";

const router = express.Router();

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { year, month, expense_amount, paid_to, reason } = req.body;
    if (!year) throw { status: 400, error: "Year is required!" };
    if (!month) throw { status: 400, error: "Month is required!" };
    if (!expense_amount)
      throw { status: 400, error: "Expense amount is required!" };
    if (!paid_to)
      throw {
        status: 400,
        error: "Please mention where you made this payment!",
      };

    const expense = new Expense(year, month, paid_to, reason);
    const warning = await expense.new(expense_amount, true);

    return res
      .status(200)
      .json({ message: warning ? warning.message : "Success!" });
  } catch (error) {
    console.error(error);
    return next(error);
  }
});

export default router;
