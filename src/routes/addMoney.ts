import express, { NextFunction, Request, Response } from "express";
import { IncomeAPI as Income } from "../apis/Income";
import { SavingsAPI as Savings } from "../apis/Savings";

const router = express.Router();

router.post(
  "/:accountType",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const accountType = req.params.accountType;
      const { year, month, amount } = req.body;
      if (!year) throw { status: 400, error: "Year is required!" };
      if (!month) throw { status: 400, error: "Month is required!" };
      if (!amount) throw { status: 400, error: "Amount is required!" };

      switch (accountType.toLowerCase()) {
        case "income":
          const income = new Income(year, month);
          await income.add(amount);
          break;

        case "savings":
          const savings = new Savings(year, month);
          await savings.deposit(amount);
          break;

        default:
          break;
      }

      return res.status(200).json({ message: "Success!" });
    } catch (error) {
      console.error(error);
      return next(error);
    }
  }
);

export default router;
