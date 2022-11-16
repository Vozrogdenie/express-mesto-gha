import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minength: 2,
    maxlength: 30,
    required: true
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true
  },
  avatar: {
    type: String,
    required: true,
  },
});

export const User = mongoose.model('user', userSchema)