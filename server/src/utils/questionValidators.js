const { body } = require("express-validator");

// validation rules for question routes

exports.createQuestionValidation = [
  body("courseId")
    .notEmpty()
    .withMessage("Course ID is required")
    .isMongoId()
    .withMessage("Invalid course ID"),

  body("question")
    .trim()
    .notEmpty()
    .withMessage("Question is required")
    .isLength({ min: 10, max: 500 })
    .withMessage("Question must be between 10 and 500 characters"),

  body("moduleId").optional().isMongoId().withMessage("Invalid module ID"),
];

exports.updateQuestionValidation = [
  body("question")
    .optional()
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage("Question must be between 10 and 500 characters"),

  body("moduleId").optional().isMongoId().withMessage("Invalid module ID"),
];
