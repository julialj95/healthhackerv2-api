const express = require("express");
const xss = require("xss");
const path = require("path");
const LogsService = require("./logs-service");
const { requireAuth } = require("../middleware/jwt-auth");
const jsonParser = express.json();
const LogsRouter = express.Router();

LogsRouter.route("/")
  // .all((req, res, next) => {
  //   res.log = log;
  //   next();
  // })
  .get(requireAuth, (req, res, next) => {
    const { user_id } = req.user.id;
    LogsService.getAllLogsForUser(req.app.get("db"), id)
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
  .all(requireAuth, (req, res, next) => {
    const { log_id } = req.params;
    ResourcesService.getLogById(req.app.get("db"), log_id).then((log) => {
      if (!log) {
        return res.status(404).json({
          error: { message: `Log doesn't exist` },
        });
      }
      res.log = log;
      next();
    });
  })

  .patch(requireAuth, (req, res, next) => {
    const {
      user_id,
      log_date,
      mood,
      stress,
      sleep_hours,
      sleep_quality,
      exercise_type,
      exercise_minutes,
      notes,
    } = req.body;
    const log_id = log.id;
    const updatedLog = {
      log_id,
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

    LogsService.editLog(req.app.get("db"), log_id, updatedLog)
      .then((res) => {
        res.status(204).end();
      })
      .catch(next);
  })
  .delete(requireAuth, (req, res, next) => {
    const id = log.id;
  });

module.exports = LogsRouter;
