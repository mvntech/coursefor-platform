const mongoose = require("mongoose");

const PlaylistSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide a user"],
    },
    name: {
      type: String,
      required: [true, "Please provide a playlist name"],
      trim: true,
      maxlength: [50, "Playlist name cannot be more than 50 characters"],
    },
    description: {
      type: String,
      maxlength: [200, "Description cannot be more than 200 characters"],
    },
    courses: [
      {
        course: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Course",
        },
        addedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    isPublic: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// index for efficient queries
PlaylistSchema.index({ user: 1 });
PlaylistSchema.index({ isPublic: 1 });

module.exports = mongoose.model("Playlist", PlaylistSchema);
