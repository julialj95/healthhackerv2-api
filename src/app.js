require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const { NODE_ENV, CLIENT_ORIGIN } = require("./config.js");
const errorHandler = require("./errorHandler");
const authorizationRouter = require("./authorization/authorization-router.js");
const UsersRouter = require("./users/users-router");
const LogsRouter = require("./logs/logs-router");
const app = express();

const morganOption = NODE_ENV === "production" ? "tiny" : "common";

app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());

app.use(
  cors({
    origin: CLIENT_ORIGIN,
  })
);

app.use(errorHandler);

app.use("/api/authorization", authorizationRouter);
app.use("/api/users", UsersRouter);
app.use("/api/logs", LogsRouter);

module.exports = app;
