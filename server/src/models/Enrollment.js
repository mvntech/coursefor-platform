const mongoose = require("mongoose");

const EnrollmentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide a user"],
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: [true, "Please provide a course"],
    },
    enrolledAt: {
      type: Date,
      default: Date.now,
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    completedAt: {
      type: Date,
    },
    completedModules: [
      {
        moduleId: {
          type: mongoose.Schema.Types.ObjectId,
        },
        completedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    completedMaterials: [
      {
        materialId: {
          type: String,
        },
        completedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
    },
    lastAccessedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// one enrollment per user per course
EnrollmentSchema.index({ user: 1, course: 1 }, { unique: true });

// index for efficient queries
EnrollmentSchema.index({ user: 1, enrolledAt: -1 });
EnrollmentSchema.index({ course: 1 });
EnrollmentSchema.index({ completed: 1 });

// calculate progress before saving
EnrollmentSchema.methods.calculateProgress = function (course) {
  if (!course || !course.modules || course.modules.length === 0) {
    this.progress = 0;
    return;
  }

  let totalMaterials = 0;
  let completedMaterialsCount = 0;

  course.modules.forEach((module) => {
    if (module.materials && module.materials.length > 0) {
      totalMaterials += module.materials.length;
      module.materials.forEach((material) => {
        const materialId = material._id ? material._id.toString() : material.id;
        if (
          this.completedMaterials.some((cm) => cm.materialId === materialId)
        ) {
          completedMaterialsCount++;
        }
      });
    }
  });

  if (totalMaterials > 0) {
    this.progress = Math.round(
      (completedMaterialsCount / totalMaterials) * 100
    );
  } else {
    this.progress = 0;
  }

  // mark as completed if progress is 100%
  if (this.progress === 100 && !this.completed) {
    this.completed = true;
    this.completedAt = new Date();
  }
};

// update course enrollment count
EnrollmentSchema.statics.updateCourseEnrollments = async function (courseId) {
  const totalEnrollments = await this.countDocuments({ course: courseId });

  try {
    const Course = mongoose.model("Course");
    await Course.findByIdAndUpdate(courseId, {
      totalEnrollments,
    });
  } catch (error) {
    console.error("Error updating course enrollments:", error);
  }
};

// call updateCourseEnrollments after save
EnrollmentSchema.post("save", function () {
  this.constructor.updateCourseEnrollments(this.course);
});

// call updateCourseEnrollments after remove
EnrollmentSchema.post("remove", function () {
  this.constructor.updateCourseEnrollments(this.course);
});

module.exports = mongoose.model("Enrollment", EnrollmentSchema);
