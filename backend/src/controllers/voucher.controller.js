import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Voucher } from "../models/voucher.model.js";
import { generateVoucherNumber } from "../utils/generateVoucherNumber.js";
import { uploadOnCloudinary } from "../config/cloudinary.js";

// CREATE DRAFT — employee only
const createVoucher = asyncHandler(async (req, res) => {
  const {
    expenseDate,
    department,
    expenseTitle,
    expenseCategory,
    expenseDescription,
    amount,
  } = req.body;

  if (!expenseDate || !department || !expenseTitle || !amount) {
    throw new ApiError(
      400,
      "Expense date, department, title, and amount are required",
    );
  }

  if (Number(amount) <= 0) {
    throw new ApiError(400, "Amount must be greater than zero");
  }

  const voucherNumber = await generateVoucherNumber();

  const voucher = await Voucher.create({
    voucherNumber,
    expenseDate,
    department,
    expenseTitle,
    expenseCategory,
    expenseDescription,
    amount,
    employee: req.user._id,
    status: "draft",
  });

  return res
    .status(201)
    .json(new ApiResponse(201, voucher, "Voucher saved as draft"));
});

// UPDATE DRAFT — employee only, only while status === "draft"
const updateVoucher = asyncHandler(async (req, res) => {
  const { voucherId } = req.params;

  const voucher = await Voucher.findById(voucherId);
  if (!voucher) {
    throw new ApiError(404, "Voucher not found");
  }

  if (voucher.employee.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You can only edit your own vouchers");
  }

  if (voucher.status !== "draft") {
    throw new ApiError(400, "Only draft vouchers can be edited");
  }

  const allowedFields = [
    "expenseDate",
    "department",
    "expenseTitle",
    "expenseCategory",
    "expenseDescription",
    "amount",
  ];

  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      voucher[field] = req.body[field];
    }
  });

  if (voucher.amount <= 0) {
    throw new ApiError(400, "Amount must be greater than zero");
  }

  await voucher.save();

  return res.status(200).json(new ApiResponse(200, voucher, "Voucher updated"));
});

// DELETE DRAFT — employee only, only while status === "draft"
const deleteVoucher = asyncHandler(async (req, res) => {
  const { voucherId } = req.params;

  const voucher = await Voucher.findById(voucherId);
  if (!voucher) {
    throw new ApiError(404, "Voucher not found");
  }

  if (voucher.employee.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You can only delete your own vouchers");
  }

  if (voucher.status !== "draft") {
    throw new ApiError(400, "Only draft vouchers can be deleted");
  }

  await Voucher.findByIdAndDelete(voucherId);

  return res.status(200).json(new ApiResponse(200, {}, "Voucher deleted"));
});

// SUBMIT VOUCHER — employee only, uploads signature, moves draft -> pending_approval
const submitVoucher = asyncHandler(async (req, res) => {
  const { voucherId } = req.params;

  const voucher = await Voucher.findById(voucherId);
  if (!voucher) {
    throw new ApiError(404, "Voucher not found");
  }

  if (voucher.employee.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "You can only submit your own vouchers");
  }

  if (voucher.status !== "draft") {
    throw new ApiError(400, "Only draft vouchers can be submitted");
  }

  const signatureLocalPath = req.file?.path;
  if (!signatureLocalPath) {
    throw new ApiError(400, "Employee signature is required to submit");
  }

  const uploadedSignature = await uploadOnCloudinary(signatureLocalPath);
  if (!uploadedSignature) {
    throw new ApiError(500, "Signature upload failed, please try again");
  }

  voucher.employeeSignature = uploadedSignature.url;
  voucher.status = "pending_approval";
  await voucher.save();

  return res
    .status(200)
    .json(new ApiResponse(200, voucher, "Voucher submitted for approval"));
});

// APPROVE VOUCHER — director only, uploads signature
const approveVoucher = asyncHandler(async (req, res) => {
  const { voucherId } = req.params;

  const voucher = await Voucher.findById(voucherId);
  if (!voucher) {
    throw new ApiError(404, "Voucher not found");
  }

  if (voucher.status !== "pending_approval") {
    throw new ApiError(400, "Only vouchers pending approval can be approved");
  }

  const signatureLocalPath = req.file?.path;
  if (!signatureLocalPath) {
    throw new ApiError(400, "Director signature is required to approve");
  }

  const uploadedSignature = await uploadOnCloudinary(signatureLocalPath);
  if (!uploadedSignature) {
    throw new ApiError(500, "Signature upload failed, please try again");
  }

  voucher.directorSignature = uploadedSignature.url;
  voucher.director = req.user._id;
  voucher.approvalDate = new Date();
  voucher.status = "approved";
  await voucher.save();

  return res
    .status(200)
    .json(new ApiResponse(200, voucher, "Voucher approved"));
});

// REJECT VOUCHER — director only, requires reason
const rejectVoucher = asyncHandler(async (req, res) => {
  const { voucherId } = req.params;
  const { rejectionReason } = req.body;

  if (!rejectionReason || !rejectionReason.trim()) {
    throw new ApiError(400, "Rejection reason is required");
  }

  const voucher = await Voucher.findById(voucherId);
  if (!voucher) {
    throw new ApiError(404, "Voucher not found");
  }

  if (voucher.status !== "pending_approval") {
    throw new ApiError(400, "Only vouchers pending approval can be rejected");
  }

  voucher.status = "rejected";
  voucher.rejectionReason = rejectionReason;
  voucher.director = req.user._id;
  await voucher.save();

  return res
    .status(200)
    .json(new ApiResponse(200, voucher, "Voucher rejected"));
});

// GET MY VOUCHERS — employee only, sees own vouchers
const getMyVouchers = asyncHandler(async (req, res) => {
  const vouchers = await Voucher.find({ employee: req.user._id }).sort({
    createdAt: -1,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, vouchers, "Vouchers fetched"));
});

// GET ALL VOUCHERS — director & accounts, with search/filter/sort
const getAllVouchers = asyncHandler(async (req, res) => {
  const {
    status,
    department,
    expenseCategory,
    search,
    dateFrom,
    dateTo,
    amountMin,
    amountMax,
    sortBy = "createdAt",
    sortOrder = "desc",
  } = req.query;

  const filter = {};

  if (status) filter.status = status;
  if (department) filter.department = department;
  if (expenseCategory) filter.expenseCategory = expenseCategory;

  if (dateFrom || dateTo) {
    filter.expenseDate = {};
    if (dateFrom) filter.expenseDate.$gte = new Date(dateFrom);
    if (dateTo) filter.expenseDate.$lte = new Date(dateTo);
  }

  if (amountMin || amountMax) {
    filter.amount = {};
    if (amountMin) filter.amount.$gte = Number(amountMin);
    if (amountMax) filter.amount.$lte = Number(amountMax);
  }

  if (search) {
    filter.$or = [
      { voucherNumber: { $regex: search, $options: "i" } },
      { expenseTitle: { $regex: search, $options: "i" } },
    ];
  }

  const vouchers = await Voucher.find(filter)
    .populate("employee", "name email department")
    .populate("director", "name email")
    .sort({ [sortBy]: sortOrder === "asc" ? 1 : -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, vouchers, "Vouchers fetched"));
});

// GET VOUCHER BY ID — role-aware: employee sees own only, director/accounts see any
const getVoucherById = asyncHandler(async (req, res) => {
  const { voucherId } = req.params;

  const voucher = await Voucher.findById(voucherId)
    .populate("employee", "name email department")
    .populate("director", "name email");

  if (!voucher) {
    throw new ApiError(404, "Voucher not found");
  }

  if (
    req.user.role === "employee" &&
    voucher.employee._id.toString() !== req.user._id.toString()
  ) {
    throw new ApiError(
      403,
      "You cannot view vouchers created by other employees",
    );
  }

  return res.status(200).json(new ApiResponse(200, voucher, "Voucher fetched"));
});

export {
  createVoucher,
  updateVoucher,
  deleteVoucher,
  submitVoucher,
  approveVoucher,
  rejectVoucher,
  getMyVouchers,
  getAllVouchers,
  getVoucherById,
};
