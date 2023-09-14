const { get, add, remove, update, getById } = require("./contacts");
const {
  addUser,
  logInUser,
  logOutUser,
  currUser,
  updateUserAvatar,
} = require("./users");

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
  updateUserAvatar,
};
