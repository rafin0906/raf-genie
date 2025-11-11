import mongoose from "mongoose";

const ctQuestionSchema = new mongoose.Schema({
    courseCode: { type: String, required: true },
    courseName: { type: String, required: true },
    ctNo: { type: [Number], required: true }, 
    sec: { type: String, required: true },
    fileUrl: { type: String, required: true },
});

export const CTQuestion = mongoose.model("CTQuestion", ctQuestionSchema);

