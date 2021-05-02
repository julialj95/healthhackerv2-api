const express = require("express");
const xss = require("xss");
const path = require("path");
const LogsService = require("./logs-service");
const { requireAuth } = require("../middleware/jwt-auth");
const jsonParser = express.json();
const LogsRouter = express.Router();
const moment = require("moment");

serializeLog = (newLog) => ({
  id: newLog.id,
  user_id: newLog.user_id,
  log_date: newLog.log_date,
  mood: newLog.mood,
  stress: newLog.stress,
  sleep_hours: newLog.sleep_hours,
  sleep_quality: newLog.sleep_quality,
  exercise_type: xss(newLog.exercise_type),
  exercise_minutes: newLog.exercise_minutes,
  water: newLog.water,
  notes: xss(newLog.notes),
});

formatLogs = (logs) => {
  return logs.map((log) => {
    return {
      id: log.id,
      user_id: log.user_id,
      log_date: moment(log.log_date).format("YYYY-MM-DD"),
      mood: log.mood,
      stress: log.stress,
      sleep_hours: parseFloat(log.sleep_hours),
      sleep_quality: log.sleep_quality,
      exercise_type: log.exercise_type,
      exercise_minutes: log.exercise_minutes,
      water: log.water,
      notes: log.notes,
    };
  });
};

LogsRouter.route("/")
  .get(requireAuth, (req, res, next) => {
    const user_id = req.user.id;

    LogsService.getAllLogsForUser(req.app.get("db"), user_id)
      .then((logs) => {
        if (!logs) {
          return res.status(400).send("No logs found.");
        }
        res.json(formatLogs(logs));
      })
      .catch(next);
  })
  .post(requireAuth, jsonParser, (req, res, next) => {
    const user_id = req.user.id;

    const {
      log_date,
      mood,
      stress,
      sleep_hours,
      sleep_quality,
      exercise_type,
      exercise_minutes,
      water,
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
      water,
      notes,
    };

    if (!mood) {
      delete newLog.mood;
    }
    if (!stress) {
      delete newLog.stress;
    }
    if (!sleep_hours) {
      delete newLog.sleep_hours;
    }
    if (!sleep_quality) {
      delete newLog.sleep_quality;
    }
    if (!exercise_minutes) {
      delete newLog.exercise_minutes;
    }
    if (!water) {
      delete newLog.water;
    }

    LogsService.createNewLog(req.app.get("db"), newLog)
      .then((log) => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${user_id}`))
          .json(serializeLog(log));
      })
      .catch(next);
  });

LogsRouter.route("/:log_id")
  .all(requireAuth, (req, res, next) => {
    const { log_id } = req.params;
    LogsService.getLogById(req.app.get("db"), log_id).then((log) => {
      if (!log) {
        return res.status(404).json({
          error: { message: `Log doesn't exist` },
        });
      }
      res.log = log;
      next();
    });
  })
  .get((req, res, next) => {
    res.json(serializeLog(res.log));
  })

  .patch(requireAuth, jsonParser, (req, res, next) => {
    const user_id = req.user.id;
    const {
      log_date,
      mood,
      stress,
      sleep_hours,
      sleep_quality,
      exercise_type,
      exercise_minutes,
      water,
      notes,
    } = req.body;
    const log_id = req.params.log_id;
    const updatedLog = {
      user_id,
      log_date,
      mood,
      stress,
      sleep_hours,
      sleep_quality,
      exercise_type,
      exercise_minutes,
      water,
      notes,
    };

    LogsService.editLog(req.app.get("db"), log_id, updatedLog)
      .then(() => {
        res.status(204).end();
      })
      .catch(next);
  })
  .delete(requireAuth, (req, res, next) => {
    LogsService.deleteLog(req.app.get("db"), res.log.id)
      .then(() => {
        res.status(204).end();
      })
      .catch(next);
  });

module.exports = LogsRouter;
