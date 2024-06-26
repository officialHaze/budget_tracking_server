import express, { NextFunction, Request, Response } from "express";
import { SavingsAPI as Savings } from "../../apis/Savings";
import { IncomeAPI as Income, Outstanding } from "../../apis/Income";
import Today from "../../apis/Today";

const router = express.Router();

router.post(
  "/deposit",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { savings_amount } = req.body;
      if (!savings_amount)
        throw { status: 400, error: "Savings amount is required!" };

      const { year, month } = Today.getYearAndMonth();

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

router.post(
  "/withdraw",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { withdraw_amount } = req.body;
      if (!withdraw_amount)
        throw { status: 400, error: "Withdraw mount is required!" };

      const { year, month } = Today.getYearAndMonth();

      const savings = new Savings(year, month);

      const currentSavingsAmount = await savings.getCurrentSavingsForMonth();

      if (withdraw_amount > currentSavingsAmount)
        throw {
          status: 400,
          error: "Withdraw amount is more than the current savings!",
        };

      await savings.withdraw(withdraw_amount);

      // Add back the withdraw amount to income
      const income = new Income(year, month);
      await income.add(withdraw_amount);

      return res.status(200).json({ message: "Amount withdrawal success!" });
    } catch (error) {
      console.error(error);
      return next(error);
    }
  }
);

export default router;
