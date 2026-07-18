
import { Counter } from "../models/counter.model.js";

export const generateVoucherNumber = async () => {
  const year = new Date().getFullYear();
  const counterId = `voucher_${year}`;

  const counter = await Counter.findByIdAndUpdate(
    counterId,
    { $inc: { seq: 1 } },
    { new: true, upsert: true },
  );

  const paddedSeq = String(counter.seq).padStart(4, "0");
  return `EXP-${year}-${paddedSeq}`;
};
