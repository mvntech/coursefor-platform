const mongoose = require("mongoose");

const AnswerSchema = new mongoose.Schema(
  {
    question: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
      required: [true, "Please provide a question"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide a user"],
    },
    answer: {
      type: String,
      required: [true, "Please provide an answer"],
      trim: true,
      maxlength: [2000, "Answer cannot be more than 2000 characters"],
    },
    isAccepted: {
      type: Boolean,
      default: false,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    totalLikes: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

AnswerSchema.index({ question: 1, createdAt: 1 });
AnswerSchema.index({ user: 1 });

AnswerSchema.pre("save", function (next) {
  this.totalLikes = this.likes.length;
  next();
});

module.exports = mongoose.model("Answer", AnswerSchema);
