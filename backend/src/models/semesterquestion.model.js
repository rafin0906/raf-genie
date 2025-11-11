import mongoose from "mongoose";

const semesterQuestionSchema = new mongoose.Schema({
    courseCode: { type: String, required: true },
    courseName: { type: String, required: true },
    year: { type: Number, required: true },
    fileUrl: { type: String, required: true },
});

export const SemesterQuestion = mongoose.model("SemesterQuestion", semesterQuestionSchema);
