const { Schema, model } = require("mongoose");


const userSchema = new Schema(
  {
    username: {
      type: String,
      trim: true,
      required: [true, 'Username is required'],
      unique: true
    },
    email: {
      type: String, 
      unique: true,
      lowercase: true,
      trim: true
    },
    role: {
      type: String,
      default: "guest"
    },
    password: {
      type: String,
      required: [true, 'Password is required']
    },
    location: String
  },
  {
    timestamps: true,
  },

);

const User = model("User", userSchema);

module.exports = User;
