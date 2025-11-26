const { body } = require("express-validator");

// validation rules for like routes

exports.toggleLikeValidation = [
  body("courseId")
    .notEmpty()
    .withMessage("Course ID is required")
    .isMongoId()
    .withMessage("Invalid course ID"),
];
