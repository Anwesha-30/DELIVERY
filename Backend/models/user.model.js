const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  fullname: {
    firstname: {
      type: String,
      required: true,
      minlength: [3, 'First name must be at least 3 characters long'],
      trim: true
    },
    lastname: {
      type: String,
      minlength: [3, 'Last name must be at least 3 characters long'],
      trim: true
    }
  },

  email: {
    type: String,
    required: true,
    unique: true,
    minlength: [5, 'Email must be at least 5 characters long']
  },

  password: {
    type: String,
    required: true,
    select: false
  }
});
userSchema.statics.hashPassword = async function(password) {
  return await bcrypt.hash(password, 10);
};
//return jwt.sign
userSchema.methods.generateAuthToken = function() {
  return jwt.sign(
    { id: this._id },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );
};
userSchema.methods.comparePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
};
module.exports = mongoose.model('User', userSchema);