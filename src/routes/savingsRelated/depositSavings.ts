import express, { NextFunction, Request, Response } from "express";
import { SavingsAPI as Savings } from "../../apis/Savings";
import { IncomeAPI as Income, Outstanding } from "../../apis/Income";

const router = express.Router();

router.post(
  "/deposit",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { year, month, savings_amount } = req.body;
      if (!year) throw { status: 400, error: "Year is required!" };
      if (!month) throw { status: 400, error: "Month is required!" };
      if (!savings_amount)
        throw { status: 400, error: "Savings amount is required!" };

      const outstandingIncome = await Outstanding.getOutstandingFor(
        year,
        month
      );

      if (outstandingIncome < savings_amount)
        throw {
          status: 400,
          error: "Savings amount is more than the outstanding income!",
        };

      const savings = new Savings(year, month);
      await savings.deposit(savings_amount);

      const income = new Income(year, month);
      await income.deduct(savings_amount);

      return res
        .status(200)
        .json({ message: "Amount deposited to savings successfully!" });
    } catch (error) {
      console.error(error);
      return next(error);
    }
  }
);

export default router;