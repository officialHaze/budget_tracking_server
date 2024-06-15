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
    expense_amount: {
      type: Number,
      required: true,
    },
    paid_to: {
      type: String,
      required: true,
    },
    reason: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Expense = mongoose.model("Expense", ExpenseSchema);

export default Expense;
