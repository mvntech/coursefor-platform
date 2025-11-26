const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema(
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
    rating: {
      type: Number,
      required: [true, "Please provide a rating"],
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      maxlength: [1000, "Comment cannot be more than 1000 characters"],
      trim: true,
    },
    isVerifiedPurchase: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// one review per user per course
ReviewSchema.index({ course: 1, user: 1 }, { unique: true });

// update course average rating when review is saved
ReviewSchema.statics.updateCourseRating = async function (courseId) {
  const stats = await this.aggregate([
    {
      $match: { course: courseId },
    },
    {
      $group: {
        _id: "$course",
        averageRating: { $avg: "$rating" },
        totalReviews: { $sum: 1 },
      },
    },
  ]);

  try {
    const Course = mongoose.model("Course");
    await Course.findByIdAndUpdate(courseId, {
      averageRating: stats[0]?.averageRating || 0,
      totalReviews: stats[0]?.totalReviews || 0,
    });
  } catch (error) {
    console.error("Error updating course rating:", error);
  }
};

// call updateCourseRating after save
ReviewSchema.post("save", function () {
  this.constructor.updateCourseRating(this.course);
});

// call updateCourseRating after remove
ReviewSchema.post("remove", function () {
  this.constructor.updateCourseRating(this.course);
});

module.exports = mongoose.model("Review", ReviewSchema);
