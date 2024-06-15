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
    income: {
      type: Number,
      required: true,
    },
    income_type: {
      type: String,
      required: true,
    },
    source: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Income = mongoose.model("Income", IncomeModelSchema);

export default Income;
