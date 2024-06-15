import mongoose from "mongoose";

const ExpenseSchema = new mongoose.Schema(
  {
    year: {
      type: Number,
      required: true,
    },
    month: {
      type: Number,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Expense = mongoose.model("Expense", ExpenseSchema);

export default Expense;
