const User = require("../models/userModel");

const getUserByEmail = async (email) => {
  const user = User.findOne({ email });
  return user;
};

//adds a user and returns its ID
const addUser = async (obj) => {
  const user = new User({
    firstName: obj.firstName,
    lastName: obj.lastName,
    email: obj.email,
    password: obj.password,
  });
  await user.save();
  return user._id;
};

const getUserById = (id) => {
  return User.findById(id).select("-password");;
};

module.exports = {getUserById, getUserByEmail, addUser };
