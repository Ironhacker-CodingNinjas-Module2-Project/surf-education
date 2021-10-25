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
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true
    },
    role: {
      type: String,
      default: "guest"
    },
    passwordHash: {
      type: String,
      required: [true, 'Password is required']
    },
    surftricks: [{type: Schema.Types.ObjectId, ref: 'Surftrick'}],

    location: String
  },
  {
    timestamps: true,
  },

);

const User = model("User", userSchema);

module.exports = User;
