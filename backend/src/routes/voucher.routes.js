import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { restrictTo } from "../middlewares/role.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
import {
  createVoucher,
  updateVoucher,
  deleteVoucher,
  submitVoucher,
  approveVoucher,
  rejectVoucher,
  getMyVouchers,
  getAllVouchers,
  getVoucherById,
} from "../controllers/voucher.controller.js";

const router = Router();

// all voucher routes require login
router.use(verifyJWT);

// Employee-only
router.route("/").post(restrictTo("employee"), createVoucher);
router.route("/my-vouchers").get(restrictTo("employee"), getMyVouchers);
router.route("/:voucherId").patch(restrictTo("employee"), updateVoucher);
router.route("/:voucherId").delete(restrictTo("employee"), deleteVoucher);
router
  .route("/:voucherId/submit")
  .patch(
    restrictTo("employee"),
    upload.single("employeeSignature"),
    submitVoucher,
  );

// Director-only
router
  .route("/:voucherId/approve")
  .patch(
    restrictTo("director"),
    upload.single("directorSignature"),
    approveVoucher,
  );
router.route("/:voucherId/reject").patch(restrictTo("director"), rejectVoucher);

// Director + Accounts (both can view all vouchers)
router.route("/").get(restrictTo("director", "accounts"), getAllVouchers);

// All three roles can view a single voucher (getVoucherById does its own employee-ownership check inside)
router.route("/:voucherId").get(getVoucherById);

export default router;
