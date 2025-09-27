import mongoose from "mongoose";

const senderSchema = new mongoose.Schema(
  {
    _id: {
      type: mongoose.Schema.Types.Mixed, // ObjectId or "ai"
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
  },
  { _id: false } // prevent extra _id for nested schema
);

const messageSchema = new mongoose.Schema({
  sender: {
    type: senderSchema,
    required: true,
  },
  content: {
    type: mongoose.Schema.Types.Mixed, // string or object (JSON)
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    lowercase: true,
    required: true,
    trim: true,
    unique: [true, "project name must be unique"],
  },
  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  messages: [messageSchema],
});

const Project = mongoose.model("Project", projectSchema);

export default Project;
