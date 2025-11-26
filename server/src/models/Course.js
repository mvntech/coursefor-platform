const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a course title"],
      trim: true,
      maxlength: [100, "Title cannot be more than 100 characters"],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, "Please provide a course description"],
      maxlength: [2000, "Description cannot be more than 2000 characters"],
    },
    shortDescription: {
      type: String,
      maxlength: [200, "Short description cannot be more than 200 characters"],
    },
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    thumbnail: {
      type: String,
      default: "",
    },
    // course content
    modules: [
      {
        title: {
          type: String,
          required: true,
          trim: true,
        },
        description: {
          type: String,
          maxlength: [
            500,
            "Module description cannot be more than 500 characters",
          ],
        },
        order: {
          type: Number,
          required: true,
          default: 0,
        },
        materials: [
          {
            title: {
              type: String,
              required: true,
              trim: true,
            },
            type: {
              type: String,
              enum: ["video", "pdf", "document", "link", "quiz"],
              required: true,
            },
            url: {
              type: String,
              required: true,
            },
            duration: {
              type: Number,
              default: 0,
            },
            order: {
              type: Number,
              default: 0,
            },
            isPreview: {
              type: Boolean,
              default: false,
            },
          },
        ],
      },
    ],
    // pricing
    isFree: {
      type: Boolean,
      default: true,
    },
    price: {
      type: Number,
      default: 0,
      min: 0,
    },
    originalPrice: {
      type: Number,
      default: 0,
      min: 0,
    },
    // course metadata
    category: {
      type: String,
      required: [true, "Please provide a category"],
      trim: true,
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    level: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "beginner",
    },
    language: {
      type: String,
      default: "English",
    },
    // statistics
    totalEnrollments: {
      type: Number,
      default: 0,
    },
    totalLikes: {
      type: Number,
      default: 0,
    },
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    totalReviews: {
      type: Number,
      default: 0,
    },
    // course status
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },
    publishedAt: {
      type: Date,
    },
    // course requirements
    requirements: [
      {
        type: String,
        trim: true,
      },
    ],
    whatYouWillLearn: [
      {
        type: String,
        trim: true,
      },
    ],
    // duration
    totalDuration: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// generate slug from title before saving
CourseSchema.pre("save", function (next) {
  if (this.isModified("title")) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }
  next();
});

// index for search optimization
CourseSchema.index({ title: "text", description: "text", tags: "text" });
CourseSchema.index({ instructor: 1, status: 1 });
CourseSchema.index({ category: 1, status: 1 });
CourseSchema.index({ isFree: 1, status: 1 });

// virtual for reviews
CourseSchema.virtual("reviews", {
  ref: "Review",
  localField: "_id",
  foreignField: "course",
  justOne: false,
});

module.exports = mongoose.model("Course", CourseSchema);
