const knex = require("knex");
const jwt = require("jsonwebtoken");
const app = require("../src/app");
const moment = require("moment");
const { makeLogsArray } = require("./logs-fixture");
const { makeUsersArray } = require("./users-fixture");
const supertest = require("supertest");

function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
  const token = jwt.sign({ id: user.id }, secret, {
    subject: user.username,
    algorithm: "HS256",
  });
  return `Bearer ${token}`;
}

describe("Logs endpoints", function () {
  let db;

  before("make knex instance", () => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DATABASE_URL,
    });
    app.set("db", db);
  });

  after("disconnect from db", () => db.destroy());

  before("clean the table", () =>
    db.raw("TRUNCATE logs, users RESTART IDENTITY CASCADE")
  );

  afterEach("cleanup", () =>
    db.raw("TRUNCATE logs, users RESTART IDENTITY CASCADE")
  );

  describe("logs endpoints", () => {
    const testUsers = makeUsersArray();
    beforeEach("insert test users", () => {
      return db.into("users").insert(testUsers);
    });

    describe("GET /api/logs", () => {
      context("Given there are no logs in the database", () => {
        it(`responds with 200 and an empty list`, () => {
          return supertest(app)
            .get("/api/logs")
            .set("Authorization", makeAuthHeader(testUsers[0]))
            .expect(200, []);
        });
      });
      context("Given there are logs in the database", () => {
        const testUserId = 1;
        const testLogs = makeLogsArray();
        beforeEach("insert test logs", () => {
          return db.into("logs").insert(testLogs);
        });
        const expectedLogs = testLogs.filter(
          (log) => log.user_id === testUserId
        );
        it(`responds with 200 and the list of logs`, () => {
          return supertest(app)
            .get("/api/logs")
            .set("Authorization", makeAuthHeader(testUsers[0]))
            .expect(200, expectedLogs);
        });
      });
    });

    describe("POST /api/logs", () => {
      const testUsers = makeUsersArray();

      it("Returns 201 and creates the new log", () => {
        const newLog = {
          user_id: 1,
          log_date: "2021-04-24",
          mood: 5,
          stress: 3,
          sleep_hours: 7.5,
          sleep_quality: 5,
          exercise_type: "Biking",
          exercise_minutes: 45,
          water: 60,
          notes: "Notes Test",
        };

        return supertest(app)
          .post("/api/logs")
          .send(newLog)
          .set("Authorization", makeAuthHeader(testUsers[0]))
          .expect(201)
          .expect((res) => {
            expect(res.body.user_id).to.eql(newLog.user_id);
            expect(moment(res.body.log_date).format("YYYY-MM-DD")).to.eql(
              moment(newLog.log_date).format("YYYY-MM-DD")
            );
            expect(res.body.mood).to.eql(newLog.mood);
            expect(res.body.stress).to.eql(newLog.stress);
            expect(parseFloat(res.body.sleep_hours)).to.eql(newLog.sleep_hours);
            expect(res.body.sleep_quality).to.eql(newLog.sleep_quality);
            expect(res.body.exercise_type).to.eql(newLog.exercise_type);
            expect(res.body.exercise_minutes).to.eql(newLog.exercise_minutes);
            expect(res.body.water).to.eql(newLog.water);
            expect(res.body.notes).to.eql(newLog.notes);
            expect(res.body).to.have.property("id");
            expect(res.headers.location).to.eql(`/api/logs/${res.body.id}`);
          })
          .then((res) => {
            return supertest(app)
              .get(`/api/logs/${res.body.id}`)
              .set("Authorization", makeAuthHeader(testUsers[0]))
              .expect(res.body);
          });
      });
    });

    describe("GET /api/logs/:log_id", () => {
      const testUsers = makeUsersArray();

      context("Given no log with matching log_id param", () => {
        it("returns 404 not found", () => {
          return supertest(app)
            .get(`/api/logs/1234`)
            .set("Authorization", makeAuthHeader(testUsers[0]))
            .expect(404, { error: { message: `Log doesn't exist` } });
        });
      });
    });
    describe("PATCH /api/logs/:log_id", () => {
      const testUsers = makeUsersArray();
      const testLogs = makeLogsArray();

      beforeEach("insert test logs into database", () => {
        return db.into("logs").insert(testLogs);
      });
      it("Updates the log and returns 204", () => {
        const idToUpdate = 2;
        const updatedLog = {
          id: 4,
          user_id: 3,
          log_date: "2021-04-27",
          mood: 4,
          stress: 3,
          sleep_hours: 7.5,
          sleep_quality: 4,
          exercise_type: "Biking",
          exercise_minutes: 45,
          notes: 60,
          notes: "Updated Notes Test",
        };
        const expectedLog = {
          ...testLogs[idToUpdate - 1],
          ...updatedLog,
        };

        return supertest(app)
          .patch(`/api/logs/${idToUpdate}`)
          .set("Authorization", makeAuthHeader(testUsers[0]))
          .send(updatedLog)
          .expect(204)
          .then(() => {
            return supertest(app)
              .get(`/api/logs/${idToUpdate}`)
              .set("Authorization", makeAuthHeader(testUsers[0]))
              .expect(expectedLog);
          });
      });
    });
    describe("DELETE /api/logs/:log_id", () => {
      const testUsers = makeUsersArray();

      context("Given the log doesn't exist", () => {
        it("Returns 404", () => {
          const log_id = 123456;
          return supertest(app)
            .delete(`/api/logs/${log_id}`)
            .set("Authorization", makeAuthHeader(testUsers[0]))
            .expect(404, { error: { message: `Log doesn't exist` } });
        });
      });
      context("Given the log exists", () => {
        const testLogs = makeLogsArray();
        const testUsers = makeUsersArray();
        beforeEach("insert test logs", () => {
          return db.into("logs").insert(testLogs);
        });
        it("Deletes the log and returns 204", () => {
          const idToRemove = 1;
          const expected = [testLogs[1]];
          return supertest(app)
            .delete(`/api/logs/${idToRemove}`)
            .set("Authorization", makeAuthHeader(testUsers[0]))
            .expect(204)
            .then(() =>
              supertest(app)
                .get(`/api/logs`)
                .set("Authorization", makeAuthHeader(testUsers[0]))
                .expect(expected)
            );
        });
      });
    });
  });
});
