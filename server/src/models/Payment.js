const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema(
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
    amount: {
      type: Number,
      required: [true, "Please provide an amount"],
      min: 0,
    },
    currency: {
      type: String,
      default: "USD",
    },
    stripePaymentIntentId: {
      type: String,
      required: true,
    },
    stripeCustomerId: {
      type: String,
    },
    paymentMethod: {
      type: String,
    },
    status: {
      type: String,
      enum: ["pending", "succeeded", "failed", "refunded"],
      default: "pending",
    },
    transactionId: {
      type: String,
      unique: true,
    },
    receiptUrl: {
      type: String,
    },
    refundedAt: {
      type: Date,
    },
    refundAmount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// index for efficient queries
PaymentSchema.index({ user: 1, createdAt: -1 });
PaymentSchema.index({ course: 1 });
PaymentSchema.index({ status: 1 });
PaymentSchema.index({ stripePaymentIntentId: 1 }, { unique: true });

// generate transaction ID before saving
PaymentSchema.pre("save", async function (next) {
  if (!this.transactionId) {
    this.transactionId = `TXN-${Date.now()}-${Math.random()
      .toString(36)
      .substr(2, 9)
      .toUpperCase()}`;
  }
  next();
});

module.exports = mongoose.model("Payment", PaymentSchema);
