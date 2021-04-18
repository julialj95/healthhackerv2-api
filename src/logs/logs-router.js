const express = require("express");
const xss = require("xss");
const path = require("path");
const LogsService = require("./logs-service");
const { requireAuth } = require("../middleware/jwt-auth");
const jsonParser = express.json();
const LogsRouter = express.Router();

LogsRouter.route("/")
  .all((req, res, next) => {
    res.resource = resource;
    next();
  })
  .get(requireAuth, (req, res, next) => {
    LogsService.getAllLogsForUser(req.app.get("db"))
      .then((logs) => {
        if (!logs) {
          return res.status(400).send("No logs found.");
        }
        res.json(logs);
      })
      .catch(next);
  })
  .post(requireAuth, jsonParser, (req, res, next) => {
    const { user_id } = req.user.id;
    const {
      log_date,
      mood,
      stress,
      sleep_hours,
      sleep_quality,
      exercise_type,
      exercise_minutes,
      notes,
    } = req.body;
    const newLog = {
      user_id,
      log_date,
      mood,
      stress,
      sleep_hours,
      sleep_quality,
      exercise_type,
      exercise_minutes,
      notes,
    };

    LogsService.createNewLog(req.app.get("db"), newLog).then(response);
  });

LogsRouter.route("/:log_id")
  .get((req, res, next) => {})
  .patch((req, res, next) => {})
  .delete((req, res, next) => {});

module.exports = LogsRouter;
