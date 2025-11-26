const { body } = require("express-validator");

// validation rules for enrollment routes

exports.enrollValidation = [
  body("courseId")
    .notEmpty()
    .withMessage("Course ID is required")
    .isMongoId()
    .withMessage("Invalid course ID"),
];

exports.updateProgressValidation = [
  body("moduleId").optional().isMongoId().withMessage("Invalid module ID"),

  body("materialId")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Material ID cannot be empty"),
];
