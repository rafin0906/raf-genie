import mongoose from "mongoose";

const classNoteSchema = new mongoose.Schema({
  courseCode: { type: String, required: true },
  courseName: { type: String, required: true },
  topic: { type: String, required: true },
  sec: { type: String, required: true },
  owner: { type: String, required: true },
  fileUrl: { type: String, required: true },
});

export const ClassNote = mongoose.model("ClassNote", classNoteSchema);
