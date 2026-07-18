import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Voucher } from "../models/voucher.model.js";

// EMPLOYEE DASHBOARD
const getEmployeeDashboard = asyncHandler(async (req, res) => {
  const employeeId = req.user._id;

  const vouchers = await Voucher.find({ employee: employeeId });

  const totalVouchers = vouchers.length;
  const draftVouchers = vouchers.filter((v) => v.status === "draft").length;
  const pendingApproval = vouchers.filter(
    (v) => v.status === "pending_approval",
  ).length;
  const approvedVouchers = vouchers.filter(
    (v) => v.status === "approved",
  ).length;
  const rejectedVouchers = vouchers.filter(
    (v) => v.status === "rejected",
  ).length;

  const totalAmountClaimed = vouchers
    .filter((v) => v.status === "approved")
    .reduce((sum, v) => sum + v.amount, 0);

  const dashboard = {
    totalVouchers,
    draftVouchers,
    pendingApproval,
    approvedVouchers,
    rejectedVouchers,
    totalAmountClaimed,
  };

  return res
    .status(200)
    .json(new ApiResponse(200, dashboard, "Employee dashboard fetched"));
});

// DIRECTOR DASHBOARD
const getDirectorDashboard = asyncHandler(async (req, res) => {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  const pendingApprovalCount = await Voucher.countDocuments({
    status: "pending_approval",
  });

  const approvedToday = await Voucher.countDocuments({
    status: "approved",
    approvalDate: { $gte: startOfToday },
  });

  const rejectedToday = await Voucher.countDocuments({
    status: "rejected",
    updatedAt: { $gte: startOfToday },
  });

  const pendingVouchers = await Voucher.find({ status: "pending_approval" });
  const totalPendingAmount = pendingVouchers.reduce(
    (sum, v) => sum + v.amount,
    0,
  );

  const recentActivity = await Voucher.find({
    status: { $in: ["approved", "rejected"] },
  })
    .sort({ updatedAt: -1 })
    .limit(5)
    .populate("employee", "name email")
    .select("voucherNumber expenseTitle amount status updatedAt employee");

  const dashboard = {
    pendingApprovalCount,
    approvedToday,
    rejectedToday,
    totalPendingAmount,
    recentActivity,
  };

  return res
    .status(200)
    .json(new ApiResponse(200, dashboard, "Director dashboard fetched"));
});

// ACCOUNTS DASHBOARD
const getAccountsDashboard = asyncHandler(async (req, res) => {
  const totalVouchers = await Voucher.countDocuments();
  const pendingApproval = await Voucher.countDocuments({
    status: "pending_approval",
  });
  const approvedVouchers = await Voucher.countDocuments({ status: "approved" });
  const rejectedVouchers = await Voucher.countDocuments({ status: "rejected" });

  const approvedList = await Voucher.find({ status: "approved" });
  const totalApprovedExpenseAmount = approvedList.reduce(
    (sum, v) => sum + v.amount,
    0,
  );

  const recentApprovedVouchers = await Voucher.find({ status: "approved" })
    .sort({ approvalDate: -1 })
    .limit(5)
    .populate("employee", "name email")
    .select("voucherNumber expenseTitle amount approvalDate employee");

  const dashboard = {
    totalVouchers,
    pendingApproval,
    approvedVouchers,
    rejectedVouchers,
    totalApprovedExpenseAmount,
    recentApprovedVouchers,
  };

  return res
    .status(200)
    .json(new ApiResponse(200, dashboard, "Accounts dashboard fetched"));
});

export { getEmployeeDashboard, getDirectorDashboard, getAccountsDashboard };
