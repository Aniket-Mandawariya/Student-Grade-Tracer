const express = require("express");
const {
  getAllGrades,
  createGrade,
  updateGrade,
  deleteGrade
} = require("../controllers/gradeController");

const router = express.Router();

router.get("/", getAllGrades);
router.post("/", createGrade);
router.put("/:id", updateGrade);
router.delete("/:id", deleteGrade);

module.exports = router;

