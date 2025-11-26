const { body } = require("express-validator");

// validation rules for answer routes

exports.createAnswerValidation = [
  body("questionId")
    .notEmpty()
    .withMessage("Question ID is required")
    .isMongoId()
    .withMessage("Invalid question ID"),

  body("answer")
    .trim()
    .notEmpty()
    .withMessage("Answer is required")
    .isLength({ min: 10, max: 2000 })
    .withMessage("Answer must be between 10 and 2000 characters"),
];

exports.updateAnswerValidation = [
  body("answer")
    .optional()
    .trim()
    .isLength({ min: 10, max: 2000 })
    .withMessage("Answer must be between 10 and 2000 characters"),
];
