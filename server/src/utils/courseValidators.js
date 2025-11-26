const { body } = require("express-validator");

// validation rules for course routes

exports.createCourseValidation = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Course title is required")
    .isLength({ min: 5, max: 100 })
    .withMessage("Title must be between 5 and 100 characters"),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Course description is required")
    .isLength({ min: 20, max: 2000 })
    .withMessage("Description must be between 20 and 2000 characters"),

  body("shortDescription")
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage("Short description cannot be more than 200 characters"),

  body("category").trim().notEmpty().withMessage("Category is required"),

  body("level")
    .optional()
    .isIn(["beginner", "intermediate", "advanced"])
    .withMessage("Level must be beginner, intermediate, or advanced"),

  body("language")
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage("Language cannot be more than 50 characters"),

  body("isFree").optional().isBoolean().withMessage("isFree must be a boolean"),

  body("price")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),

  body("originalPrice")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Original price must be a positive number"),

  body("tags").optional().isArray().withMessage("Tags must be an array"),

  body("tags.*")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Tag cannot be empty"),

  body("requirements")
    .optional()
    .isArray()
    .withMessage("Requirements must be an array"),

  body("whatYouWillLearn")
    .optional()
    .isArray()
    .withMessage("What you will learn must be an array"),

  body("modules").optional().isArray().withMessage("Modules must be an array"),
];

exports.updateCourseValidation = [
  body("title")
    .optional()
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage("Title must be between 5 and 100 characters"),

  body("description")
    .optional()
    .trim()
    .isLength({ min: 20, max: 2000 })
    .withMessage("Description must be between 20 and 2000 characters"),

  body("shortDescription")
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage("Short description cannot be more than 200 characters"),

  body("category")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Category cannot be empty"),

  body("level")
    .optional()
    .isIn(["beginner", "intermediate", "advanced"])
    .withMessage("Level must be beginner, intermediate, or advanced"),

  body("isFree").optional().isBoolean().withMessage("isFree must be a boolean"),

  body("price")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),

  body("status")
    .optional()
    .isIn(["draft", "published", "archived"])
    .withMessage("Status must be draft, published, or archived"),
];

exports.moduleValidation = [
  body("modules")
    .isArray()
    .withMessage("Modules must be an array")
    .notEmpty()
    .withMessage("At least one module is required"),

  body("modules.*.title")
    .trim()
    .notEmpty()
    .withMessage("Module title is required"),

  body("modules.*.description")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Module description cannot be more than 500 characters"),

  body("modules.*.order")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Module order must be a non-negative integer"),

  body("modules.*.materials")
    .optional()
    .isArray()
    .withMessage("Materials must be an array"),

  body("modules.*.materials.*.title")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Material title is required"),

  body("modules.*.materials.*.type")
    .optional()
    .isIn(["video", "pdf", "document", "link", "quiz"])
    .withMessage("Material type must be video, pdf, document, link, or quiz"),

  body("modules.*.materials.*.url")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Material URL is required"),
];
