import Savings from "../models/Savings";

export class SavingsAPI {
  private year: number;
  private month: number;

  constructor(year: number, month: number) {
    this.year = year;
    this.month = month;
  }

  public async deposit(amount: number) {
    try {
      const existingSavingsRecord = await Savings.findOne({
        year: this.year,
        month: this.month,
      }).sort({ created_at: -1 });

      if (!existingSavingsRecord) return await this.new(amount);

      this.update(amount, existingSavingsRecord.savings_amount, "add");
    } catch (err) {
      throw err;
    }
  }

  public async withdraw(amount: number) {
    try {
      const existingSavingsRecord = await Savings.findOne({
        year: this.year,
        month: this.month,
      }).sort({ created_at: -1 });

      if (!existingSavingsRecord)
        throw new Error(
          "No savings record found for the given year and month!"
        );

      await this.update(amount, existingSavingsRecord.savings_amount, "deduct");
    } catch (error) {
      throw error;
    }
  }

  private async new(amount: number) {
    try {
      console.log("*** Creating new Savings record ***");
      const newSavings = new Savings({
        year: this.year,
        month: this.month,
        savings_amount: amount,
      });
      const savingsCreated = await newSavings.save();
      console.log({ savingsCreated });
    } catch (error) {
      throw error;
    }
  }

  private async update(newAmt: number, oldAmt: number, to: string) {
    try {
      let newSavingsAmt = 0;

      if (to === "add") newSavingsAmt = oldAmt + newAmt;
      else if (to === "deduct") newSavingsAmt = oldAmt - newAmt;

      if (newSavingsAmt <= 0)
        throw new Error(" !!! Alert! Savings cannot be zero or negative!");

      console.log("*** Updating existing Income record ***");
      const updatedSavings = await Savings.findOneAndUpdate(
        { year: this.year, month: this.month },
        { savings_amount: newSavingsAmt },
        { new: true }
      );
      console.log({ updatedSavings });
    } catch (error) {
      throw error;
    }
  }
}
