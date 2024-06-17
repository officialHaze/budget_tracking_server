import express, { NextFunction, Request, Response } from "express";
import { IncomeAPI as Income } from "../../apis/Income";

const router = express.Router();

// Get income report for a month of a year
router.get(
  "/month/:year/:month",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { year, month } = req.params;

      const { totalOutstanding, incomeRecord, downloadReport } =
        await Income.getReportForMonthOf(parseInt(year), parseInt(month));

      return res
        .status(200)
        .json({
          message: "Success!",
          totalOutstanding,
          incomeRecord,
          downloadReport,
        });
    } catch (error) {
      console.error(error);
      return next(error);
    }
  }
);

// Get income report for a year
router.get(
  "/year/:year",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { year } = req.params;

      const { totalOutstanding, incomeRecords, downloadReport } =
        await Income.getReportForYear(parseInt(year));

      return res
        .status(200)
        .json({
          message: "Success!",
          year,
          totalOutstanding,
          incomeRecords,
          downloadReport,
        });
    } catch (error) {
      console.error(error);
      return next(error);
    }
  }
);

export default router;
