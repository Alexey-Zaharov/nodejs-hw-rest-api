require("dotenv").config();
const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const contactsRouter = require("./routes/api/contacts");
const userRouter = require("./routes/api/user");
const app = express();
const formatsLogger = app.get("env") === "development" ? "dev" : "short";

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());
app.use("/api/contacts", contactsRouter);
app.use("/api/users", userRouter);
app.use("/avatars", express.static(`${__dirname}/public/avatars`));

app.use((_, res, __) => {
  res.status(404).json({
    status: "error",
    code: 404,
    message: "Use api on routes: /api",
    data: "Not found",
  });
});

app.use((err, _, res, __) => {
  console.log(err.stack);
  res.status(500).json({
    status: "fail",
    code: 500,
    message: err.message,
    data: "Internal Server Error",
  });
});

module.exports = app;
