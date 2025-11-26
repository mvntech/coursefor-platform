const { body } = require("express-validator");

// validation rules for payment routes

exports.createPaymentIntentValidation = [
  body("courseId")
    .notEmpty()
    .withMessage("Course ID is required")
    .isMongoId()
    .withMessage("Invalid course ID"),
];

exports.confirmPaymentValidation = [
  body("paymentIntentId")
    .notEmpty()
    .withMessage("Payment Intent ID is required")
    .trim(),
];
