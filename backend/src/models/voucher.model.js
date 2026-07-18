import mongoose, { Schema } from "mongoose";

const voucherSchema = new Schema(
  {
    voucherNumber: {
      type: String,
      required: true,
      unique: true,
    },

    // Basic Information
    voucherDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    expenseDate: {
      type: Date,
      required: [true, "Expense date is required"],
    },
    department: {
      type: String,
      required: [true, "Department is required"],
      trim: true,
    },
    expenseTitle: {
      type: String,
      required: [true, "Expense title is required"],
      trim: true,
    },
    expenseCategory: {
      type: String,
      required: true,
      trim: true,
    },
    expenseDescription: {
      type: String,
      trim: true,
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0.01, "Amount must be greater than zero"],
    },

    // Employee Information
    employee: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    employeeSignature: {
      type: String, // Cloudinary URL
    },

    // Workflow / Status
    status: {
      type: String,
      enum: ["draft", "pending_approval", "approved", "rejected"],
      default: "draft",
    },

    // Approval Information
    director: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    directorSignature: {
      type: String, // Cloudinary URL
    },
    approvalDate: {
      type: Date,
    },
    rejectionReason: {
      type: String,
    },
  },
  { timestamps: true }, 
);

export const Voucher = mongoose.model("Voucher", voucherSchema);
