const express = require("express");
const xss = require("xss");
const path = require("path");
const GoalsService = require("./goals-service");
const { requireAuth } = require("../middleware/jwt-auth");
const jsonParser = express.json();
const GoalsRouter = express.Router();

GoalsRouter.route("/")
  .get(requireAuth, (req, res, next) => {
    const { user_id } = req.body;
    GoalsService.getGoalsForUser(req.app.get("db"), user_id)
      .then((goals) => {
        if (!goals) return res.status(400).send("No logs found.");
        res.json(goals);
      })
      .catch(next);
  })
  .post(requireAuth, jsonParser, (req, res, next) => {
    const { user_id, goal_1, goal_2, goal_3 } = req.body;
    const newGoals = { user_id, goal_1, goal_2, goal_3 };

    GoalsService.createNewGoals(req.app.get("db"), newGoals)
      .then((response) => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${user_id}`))
          .json({
            user_id: response.user_id,
            goal_1: xss(response.goal_1),
            goal_2: xss(response.goal_2),
            goal_3: xss(response.goal_3),
          });
      })
      .catch(next);
  });

module.exports = GoalsRouter;
