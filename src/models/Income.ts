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
    outstanding: {
      type: Number,
      required: true,
    },
    income_added: {
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
