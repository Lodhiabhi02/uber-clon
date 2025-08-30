const userModel = require("../models/user.model");

module.exports.createUser = async ({ email, fullname, password }) => {
  if (!fullname || !email || !password) {
    throw new Error("All fields are required");
  }

  const user = await userModel.create({
    fullname: {
      firstname: fullname.firstname,
      lastname: fullname.lastname,
    },
    email,
    password,
  });

  return user;
};
