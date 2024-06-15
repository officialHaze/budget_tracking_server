import mongoose from "mongoose";

const IncomeModelSchema = new mongoose.Schema(
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

const Income = mongoose.model("Income", IncomeModelSchema);

export default Income;
