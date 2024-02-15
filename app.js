import createError from "http-errors";
import express from "express";
import dotenv from "dotenv";
import path from "path";
import logger from "morgan";
import mongoose from "mongoose";

const app = express();
dotenv.config();

import indexRouter from "./routes/index.js";
import companyRouter from "./api/Setting/company/company.route.js";
import { fileURLToPath } from "url";
import userRouter from "./api/Setting/user/user.route.js";
import adminRouter from "./api/Setting/admin/admin.route.js";
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const __filename = fileURLToPath(import.meta.url); // Get directory name using import.meta.url
const __dirname = path.dirname(__filename); // Get directory name using import.meta.url
app.use("/", express.static(__dirname + "/public"));

app.use("/", indexRouter);
app.use("/company", companyRouter);
app.use("/user", userRouter);
app.use("/admin", adminRouter);

mongoose.set("strictQuery", false);

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect(process.env.MONGODB_URL);
}

app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  res.status(err.status || 500);
  res.render("error");
});

export default app;
