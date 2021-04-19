const LogsService = {
  getAllLogsForUser(knex, user_id) {
    return knex.select("*").from("logs").where("user_id", user_id);
  },
  getLogByDate(knex, date) {
    return knex.select("*").from("logs").where("date", date).first();
  },
  createNewLog(knex, newLog) {
    return knex("logs")
      .insert(newLog)
      .returning("*")
      .then((rows) => rows[0]);
  },
  editLog(knex, id, updatedLog) {
    return knex.from("logs").where("id", id).update(updatedLog);
  },
  deleteLog(knex, id) {
    return knex.from("logs").where("id", id).delete();
  },
};

module.exports = LogsService;
