import Income from "../models/Income";

export class IncomeAPI {
  year: number; // Year on which income is generated
  month: number; // Month on which income is generated

  constructor(year: number, month: number) {
    this.year = year;
    this.month = month;
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
          amount,
        });
        console.log("*** Creating new income ***");
        const savedIncome = await newIncome.save();
        console.log(savedIncome);
        return;
      }

      // Update the existing record
      console.log("*** Updating existing income ***");
      const newAmt = income.amount + amount;
      const updatedIncome = await Income.findOneAndUpdate(
        { year: this.year, month: this.month },
        { amount: newAmt },
        { new: true }
      );
      console.log(updatedIncome);
    } catch (error) {
      throw error;
    }
  }
}
