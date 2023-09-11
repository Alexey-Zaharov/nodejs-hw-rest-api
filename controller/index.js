const { get, add, remove, update, getById } = require("./contacts");
const { addUser, logInUser, logOutUser, currUser } = require("./users");

module.exports = {
  get,
  add,
  remove,
  update,
  getById,
  addUser,
  logInUser,
  logOutUser,
  currUser,
};
