const { User } = require("../schemas");

const getUser = async ({ email }) => {
  return User.findOne({ email });
};

const getUserById = async (id) => {
  return User.findById(id);
};

const addUser = async (newUser) => {
  return User.create(newUser);
};

const updateUser = async (userId, body) => {
  return User.findByIdAndUpdate(userId.toString(), body, { new: true });
};

const getCurrUser = async (token) => {
  return User.findOne({ token });
};

module.exports = {
  getUser,
  addUser,
  updateUser,
  getUserById,
  getCurrUser,
};
