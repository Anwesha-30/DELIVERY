const userModel = require('../models/user.model');

module.exports.createUser = async ({
  firstname,
  lastname,
  email,
  password
}) => {
  // Check required fields
  if (!firstname || !email || !password) {
    throw new Error('All fields are required');
  }

  // Create user
  const user = await userModel.create({
    fullname: {
      firstname,
      lastname
    },
    email,
    password
  });

  return user;
};