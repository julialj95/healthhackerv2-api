const bcrypt = require("bcryptjs");

function makeUsersArray() {
  return [
    { id: 1, username: "TestUser1", password: bcrypt.hashSync("Password1") },
    { id: 2, username: "User2Test", password: bcrypt.hashSync("Password2") },
    { id: 3, username: "AnotherUser", password: bcrypt.hashSync("Password3") },
  ];
}

module.exports = { makeUsersArray };
