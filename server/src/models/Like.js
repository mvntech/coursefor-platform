const mongoose = require("mongoose");

const LikeSchema = new mongoose.Schema(
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
  },
  {
    timestamps: true,
  }
);

// one like per user per course
LikeSchema.index({ course: 1, user: 1 }, { unique: true });

// update course totalLikes when like is saved
LikeSchema.statics.updateCourseLikes = async function (courseId) {
  const totalLikes = await this.countDocuments({ course: courseId });

  try {
    const Course = mongoose.model("Course");
    await Course.findByIdAndUpdate(courseId, {
      totalLikes,
    });
  } catch (error) {
    console.error("Error updating course likes:", error);
  }
};

// call updateCourseLikes after save
LikeSchema.post("save", function () {
  this.constructor.updateCourseLikes(this.course);
});

// call updateCourseLikes after remove
LikeSchema.post("remove", function () {
  this.constructor.updateCourseLikes(this.course);
});

module.exports = mongoose.model("Like", LikeSchema);
