const { body } = require("express-validator");

// validation rules for playlist routes

exports.createPlaylistValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Playlist name is required")
    .isLength({ min: 2, max: 50 })
    .withMessage("Playlist name must be between 2 and 50 characters"),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage("Description cannot be more than 200 characters"),

  body("isPublic")
    .optional()
    .isBoolean()
    .withMessage("isPublic must be a boolean"),
];

exports.updatePlaylistValidation = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage("Playlist name must be between 2 and 50 characters"),

  body("description")
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage("Description cannot be more than 200 characters"),

  body("isPublic")
    .optional()
    .isBoolean()
    .withMessage("isPublic must be a boolean"),
];

exports.addCourseValidation = [
  body("courseId")
    .notEmpty()
    .withMessage("Course ID is required")
    .isMongoId()
    .withMessage("Invalid course ID"),
];
