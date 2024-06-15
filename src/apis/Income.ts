import Income from "../models/Income";

export class IncomeAPI {
  year: number; // Year on which income is generated
  month: number; // Month on which income is generated

  type: string;
  source?: string;

  constructor(year: number, month: number, type: string, source?: string) {
    this.year = year;
    this.month = month;
    this.type = type;
    this.source = source;
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
          income_type: this.type,
          source: this.source,
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
}
