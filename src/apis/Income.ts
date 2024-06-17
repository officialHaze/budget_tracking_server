import Income from "../models/Income";
import DownloadLinkGenerator from "./DownloadLinkGenerator";
import FileSaver from "./FileSaver";
import GroupData from "./GroupData";
import Parser from "./Parser";
import Workbook from "./Workbook";

export class IncomeAPI {
  private year: number; // Year on which income is generated
  private month: number; // Month on which income is generated

  constructor(year: number, month: number) {
    this.year = year;
    this.month = month;
  }

  public async new(amount: number) {
    try {
      const newIncome = new Income({
        year: this.year,
        month: this.month,
        income_added: amount,
        outstanding: await Outstanding.calculateOutstandingFor(
          amount,
          this.year,
          this.month
        ),
      });
      console.log("*** Creating new Income record ***");
      const savedIncome = await newIncome.save();
      console.log(savedIncome);
    } catch (error) {
      throw error;
    }
  }

  public async update(
    newAmount: number,
    oldAddedIncome: number,
    oldOutstanding: number,
    to: string
  ) {
    try {
      let newOutstanding = oldOutstanding;
      let newIncomeAdded = oldAddedIncome;

      if (to === "add") {
        newOutstanding = oldOutstanding + newAmount;
        newIncomeAdded = oldAddedIncome + newAmount;
      } else if (to === "deduct") newOutstanding = oldOutstanding - newAmount;
      else throw new Error("Provide a valid update identifier!");

      if (newOutstanding < 0)
        throw new Error("!!! Alert! Oustanding income is going below zero!");

      console.log("*** Updating existing Income record ***");
      const updatedIncome = await Income.findOneAndUpdate(
        { year: this.year, month: this.month },
        { outstanding: newOutstanding, income_added: newIncomeAdded },
        { new: true }
      );
      console.log(updatedIncome);
    } catch (error) {
      throw error;
    }
  }

  public async add(amount: number) {
    try {
      // Find the income record from DB for the
      // provided month and year.
      const income = await Income.findOne({
        year: this.year,
        month: this.month,
      }).sort({ created_at: -1 }); // Latest record

      if (!income) {
        // Create a new income record
        await this.new(amount);
        return;
      }

      // Update the existing record
      await this.update(amount, income.income_added, income.outstanding, "add");
    } catch (error) {
      throw error;
    }
  }

  public async deduct(amount: number) {
    try {
      // Find the income record from DB for the
      // provided month and year.
      const income = await Income.findOne({
        year: this.year,
        month: this.month,
      }).sort({ created_at: -1 }); // Latest record

      if (!income)
        throw new Error(
          "No income report found for the provided year and month!"
        );

      await this.update(
        amount,
        income.income_added,
        income.outstanding,
        "deduct"
      );
    } catch (error) {
      throw error;
    }
  }

  // Get income report for a particular month of a particular year
  public static async getReportForMonthOf(year: number, month: number) {
    try {
      const incomeRecord = await Income.findOne(
        { year, month },
        { __v: false }
      ).lean();
      if (!incomeRecord) throw new Error("No income record found!");

      const serializedIncomeRecord = {
        Outstanding: incomeRecord.outstanding,
        "Total income added": incomeRecord.income_added,
        Date: incomeRecord.createdAt,
      };

      const wb = new Workbook();
      const ws = Parser.jsonToExcel([serializedIncomeRecord]);
      wb.appendSheet(ws, "IncomeRecord");

      // Save the wb
      const filename = `${Date.now()}_income_report.xlsx`;
      FileSaver.saveExcel(wb.getWbInstance(), filename);

      return {
        incomeRecord,
        downloadReport: DownloadLinkGenerator.reportDownloadLink(filename),
      };
    } catch (error) {
      throw error;
    }
  }

  // Get income report of a particular year
  public static async getReportForYear(year: number) {
    try {
      const incomeRecords = await Income.find(
        { year },
        { __v: false, updatedAt: false }
      ).lean();
      if (incomeRecords.length <= 0)
        throw new Error("No income records found!");

      // Group the data as per each month
      const groupedData = GroupData.groupByMonth(incomeRecords);

      const wb = new Workbook();
      groupedData.forEach((group) => {
        // Serialize the records
        const serializedRecords = group.records.map((record) => {
          return {
            Outstanding: record.outstanding,
            "Total income added": record.income_added,
            Date: record.createdAt,
          };
        });
        // Create a ws
        const ws = Parser.jsonToExcel(serializedRecords);
        wb.appendSheet(ws, group.month);
      });

      // Save the wb
      const filename = `${Date.now()}_income_report_${year}.xlsx`;
      FileSaver.saveExcel(wb.getWbInstance(), filename);

      return {
        incomeRecords: groupedData,
        downloadReport: DownloadLinkGenerator.reportDownloadLink(filename),
      };
    } catch (error) {
      throw error;
    }
  }
}

export class Outstanding {
  public static async calculateOutstandingFor(
    income: number,
    year: number,
    month: number
  ) {
    try {
      let prevMonth = month - 1;
      let year_ = year;

      let prevMonthOutstanding = income;

      if (prevMonth < 1) {
        // Get the last month of prev year
        prevMonth = 12;
        year_ = year - 1;
      }

      const prevIncome = await Income.findOne(
        { year: year_, month: prevMonth },
        { outstanding: true }
      );
      if (prevIncome) prevMonthOutstanding += prevIncome.outstanding;

      return prevMonthOutstanding;
    } catch (error) {
      throw error;
    }
  }

  public static async getOutstandingFor(year: number, month: number) {
    try {
      let outstanding = 0;

      const income = await Income.findOne({
        year,
        month,
      }).sort({ created_at: -1 }); // Latest record

      if (income) outstanding += income.outstanding;

      return outstanding;
    } catch (error) {
      throw error;
    }
  }
}
