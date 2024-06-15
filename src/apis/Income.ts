import Income from "../models/Income";

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

  public async update(newAmount: number, oldAmount: number, to: string) {
    try {
      let newOutstanding = 0;

      if (to === "add") newOutstanding = oldAmount + newAmount;
      else if (to === "deduct") newOutstanding = oldAmount - newAmount;

      if (newOutstanding < 0)
        throw new Error("!!! Alert! Oustanding income is going below zero!");

      console.log("*** Updating existing Income record ***");
      const updatedIncome = await Income.findOneAndUpdate(
        { year: this.year, month: this.month },
        { outstanding: newOutstanding },
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
      await this.update(amount, income.outstanding, "add");
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

      await this.update(amount, income.outstanding, "deduct");
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
