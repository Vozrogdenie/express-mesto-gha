import mongoose from "mongoose";

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true
  },
  link: {
    type: String,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'holder',
    required: true
  },
  likes: {
    type: mongoose.Schema.Types.ObjectId,
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
})

export const Card = mongoose.model('card', cardSchema)