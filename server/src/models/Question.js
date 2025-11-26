const mongoose = require("mongoose");

const QuestionSchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: [true, "Please provide a course"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide a user"],
    },
    question: {
      type: String,
      required: [true, "Please provide a question"],
      trim: true,
      maxlength: [500, "Question cannot be more than 500 characters"],
    },
    moduleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course.modules",
    },
    isResolved: {
      type: Boolean,
      default: false,
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// index for efficient queries
QuestionSchema.index({ course: 1, createdAt: -1 });
QuestionSchema.index({ user: 1 });
QuestionSchema.index({ isResolved: 1 });

// virtual for answers
QuestionSchema.virtual("answers", {
  ref: "Answer",
  localField: "_id",
  foreignField: "question",
  justOne: false,
});

module.exports = mongoose.model("Question", QuestionSchema);
