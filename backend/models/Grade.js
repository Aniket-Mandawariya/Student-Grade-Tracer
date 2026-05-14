const mongoose = require("mongoose");

const gradeSchema = new mongoose.Schema(
  {
    studentName: {
      type: String,
      required: [true, "Student name is required"],
      trim: true
    },
    subject: {
      type: String,
      required: [true, "Subject name is required"],
      trim: true
    },
    marks: {
      type: Number,
      required: [true, "Marks are required"],
      min: [0, "Marks cannot be less than 0"],
      max: [100, "Marks cannot be greater than 100"]
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Grade", gradeSchema);
