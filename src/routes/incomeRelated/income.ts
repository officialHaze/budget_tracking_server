// Route controller to handle Income related stuffs

import express, { NextFunction, Request, Response } from "express";
import { IncomeAPI as Income } from "../../apis/Income";

const router = express.Router();

router.post("/add", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { year, month, amount } = req.body;
    if (!year) throw { status: 400, error: "Year is required!" };
    if (!month) throw { status: 400, error: "Month is required!" };
    if (!amount) throw { status: 400, error: "Amount is required!" };

    const income = new Income(year, month);
    await income.add(amount);

    return res.status(200).json({ message: "Income added successfully!" });
  } catch (err) {
    console.error(err);
    return next(err);
  }
});

export default router;
