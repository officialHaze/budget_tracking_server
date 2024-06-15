import Income from "../models/Income";

export class IncomeAPI {
  private year: number; // Year on which income is generated
  private month: number; // Month on which income is generated

  constructor(year: number, month: number) {
    this.year = year;
    this.month = month;
  }

  private async calculateOutstanding(income: number) {
    try {
      let prevMonth = this.month - 1;
      let year = this.year;

      let prevMonthIncome = income;

      if (prevMonth < 1) {
        // Get the last month of prev year
        prevMonth = 12;
        year = this.year - 1;
      }

      const prevIncome = await Income.findOne(
        { year, month: prevMonth },
        { income: true }
      );
      if (prevIncome) prevMonthIncome += prevIncome.income;

      return prevMonthIncome;
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

      if (income) outstanding += income.income;

      return outstanding;
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
        const newIncome = new Income({
          year: this.year,
          month: this.month,
          income: await this.calculateOutstanding(amount),
        });
        console.log("*** Creating new income ***");
        const savedIncome = await newIncome.save();
        console.log(savedIncome);
        return;
      }

      // Update the existing record
      console.log("*** Updating existing income ***");
      const newAmt = income.income + amount;
      const updatedIncome = await Income.findOneAndUpdate(
        { year: this.year, month: this.month },
        { income: newAmt },
        { new: true }
      );
      console.log(updatedIncome);
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

      // Update the existing record
      console.log("*** Updating existing income record ***");
      const incomeAfterExpense = income.income - amount;

      if (incomeAfterExpense < 0)
        throw new Error(
          "!!! Alert! Expense is more than the current outstanding income!"
        );

      const updatedIncome = await Income.findOneAndUpdate(
        { year: this.year, month: this.month },
        { income: incomeAfterExpense },
        { new: true }
      );
      console.log(updatedIncome);
    } catch (error) {
      throw error;
    }
  }
}
