const Grade = require("../models/Grade");

const calculateSummary = (grades) => {
  const totalSubjects = grades.length;
  const totalMarks = grades.reduce((sum, grade) => sum + grade.marks, 0);
  const averageMarks = totalSubjects === 0 ? 0 : totalMarks / totalSubjects;
  const gpa = totalSubjects === 0 ? 0 : Math.min(4, (averageMarks / 100) * 4);

  return {
    totalSubjects,
    totalMarks: Number(totalMarks.toFixed(2)),
    averageMarks: Number(averageMarks.toFixed(2)),
    gpa: Number(gpa.toFixed(2))
  };
};

const getAllGrades = async (req, res, next) => {
  try {
    const grades = await Grade.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Grades fetched successfully",
      grades,
      summary: calculateSummary(grades)
    });
  } catch (error) {
    next(error);
  }
};

const createGrade = async (req, res, next) => {
  try {
    const { studentName, subject, marks } = req.body;

    if (
      !studentName ||
      !subject ||
      marks === undefined ||
      marks === null ||
      marks === ""
    ) {
      return res.status(400).json({
        success: false,
        message: "Student name, subject, and marks are required"
      });
    }

    const newGrade = await Grade.create({
      studentName,
      subject,
      marks
    });

    res.status(201).json({
      success: true,
      message: "Grade added successfully",
      grade: newGrade
    });
  } catch (error) {
    next(error);
  }
};

const updateGrade = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { studentName, subject, marks } = req.body;

    if (
      !studentName ||
      !subject ||
      marks === undefined ||
      marks === null ||
      marks === ""
    ) {
      return res.status(400).json({
        success: false,
        message: "Student name, subject, and marks are required"
      });
    }

    const updatedGrade = await Grade.findByIdAndUpdate(
      id,
      { studentName, subject, marks },
      { new: true, runValidators: true }
    );

    if (!updatedGrade) {
      return res.status(404).json({
        success: false,
        message: "Grade record not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Grade updated successfully",
      grade: updatedGrade
    });
  } catch (error) {
    next(error);
  }
};

const deleteGrade = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deletedGrade = await Grade.findByIdAndDelete(id);

    if (!deletedGrade) {
      return res.status(404).json({
        success: false,
        message: "Grade record not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Grade deleted successfully"
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllGrades,
  createGrade,
  updateGrade,
  deleteGrade
};
