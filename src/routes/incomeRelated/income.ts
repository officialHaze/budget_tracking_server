// Route controller to handle Income related stuffs

import express, { NextFunction, Request, Response } from "express";
import { IncomeAPI as Income } from "../../apis/Income";

const router = express.Router();

router.post("/add", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { year, month, income, type, source } = req.body;
    if (!year) throw { status: 400, error: "Year is required!" };
    if (!month) throw { status: 400, error: "Month is required!" };
    if (!income) throw { status: 400, error: "Income is required!" };
    if (!type) throw { status: 400, error: "Income type is required!" };

    const income_ = new Income(year, month, type, source);
    await income_.add(income);

    return res.status(200).json({ message: "Income added successfully!" });
  } catch (err) {
    console.error(err);
    return next(err);
  }
});

export default router;
