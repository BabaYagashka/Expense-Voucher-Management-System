import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { restrictTo } from "../middlewares/role.middleware.js";
import {
  getEmployeeDashboard,
  getDirectorDashboard,
  getAccountsDashboard,
} from "../controllers/dashboard.controller.js";

const router = Router();

router.use(verifyJWT);

router.route("/employee").get(restrictTo("employee"), getEmployeeDashboard);
router.route("/director").get(restrictTo("director"), getDirectorDashboard);
router.route("/accounts").get(restrictTo("accounts"), getAccountsDashboard);

export default router;
