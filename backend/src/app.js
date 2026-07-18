import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import voucherRouter from "./routes/voucher.routes.js";
import dashboardRouter from "./routes/dashboard.routes.js";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  }),
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/vouchers", voucherRouter);
app.use("/api/v1/dashboard", dashboardRouter);

app.use(errorHandler);
export default app;
