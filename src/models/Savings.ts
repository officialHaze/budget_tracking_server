import mongoose from "mongoose";

const SavingSchema = new mongoose.Schema(
  {
    year: {
      type: Number,
      required: true,
    },
    month: {
      type: Number,
      required: true,
    },
    savings_amount: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const Savings = mongoose.model("Savings", SavingSchema);

export default Savings;
