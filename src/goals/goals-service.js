const GoalsService = {
  getGoalsForUser(knex, user_id) {
    return knex.select("*").from("goals").where("user_id", user_id);
  },
  addNewUserGoals(knex, goals) {
    return knex("goals")
      .insert(goals)
      .returning("*")
      .then((rows) => rows[0]);
  },
  editUserGoals(knex, user_id, updatedGoals) {
    return knex.from("goals").where("user_id", user_id).update(updatedGoals);
  },
};
