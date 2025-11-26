const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide a name"],
        trim: true,
        maxlength: [50, "Name cannot be more than 50 characters"]
    },
    email: {
        type: String,
        required: [true, "Please provide an email"],
        unique: true,
        lowercase: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            "Please provide a valid email"
        ]
    },
    password: {
        type: String,
        required: [true, "Please provide a password"],
        minlength: [6, "Password must be at least 6 characters"],
        select: false
    },
    role: {
        type: String,
        enum: ["learner", "instructor", "admin"],
        default: "learner"
    },
    avatar: {
        type: String,
        default: ""
    },
    bio: {
        type: String,
        maxlength: [500, "Bio cannot be more than 500 characters"],
        default: ""
    },
    // instructor specific fields
    expertise: [{
        type: String,
        trim: true
    }],
    experience: {
        type: Number,
        default: 0
    },
    // learner specific fields
    enrolledCourses: [{
        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course"
        },
        enrolledAt: {
            type: Date,
            default: Date.now
        },
        progress: {
            type: Number,
            default: 0,
            min: 0,
            max: 100
        },
        completed: {
            type: Boolean,
            default: false
        }
    }],
    // common fields
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    emailVerificationToken: String,
    emailVerificationExpire: Date,
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    isActive: {
        type: Boolean,
        default: true
    },
    lastLogin: {
        type: Date
    }
}, {
    timestamps: true // adds createdAt and updatedAt automatically
});

// hash password before saving
UserSchema.pre("save", async function(next) {
    // only hash if password is modified
    if (!this.isModified("password")) {
        return next();
    }
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// method to compare password
UserSchema.methods.comparePassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// method to generate JWT token
UserSchema.methods.generateToken = function() {
    return jwt.sign(
        { 
            id: this._id,
            role: this.role,
            email: this.email
        },
        process.env.JWT_SECRET,
        {
            expiresIn: process.env.JWT_EXPIRE || "7d"
        }
    );
};

// method to generate email verification token
UserSchema.methods.generateEmailVerificationToken = function() {
    const crypto = require("crypto");
    const token = crypto.randomBytes(32).toString("hex");
    
    this.emailVerificationToken = crypto.createHash("sha256").update(token).digest("hex");
    this.emailVerificationExpire = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
    
    return token;
};

// method to generate password reset token
UserSchema.methods.generatePasswordResetToken = function() {
    const crypto = require("crypto");
    const token = crypto.randomBytes(32).toString("hex");
    
    this.resetPasswordToken = crypto.createHash("sha256").update(token).digest("hex");
    this.resetPasswordExpire = Date.now() + 60 * 60 * 1000; // 1 hour
    
    return token;
};

// method to get user data without sensitive information
UserSchema.methods.toJSON = function() {
    const userObject = this.toObject();
    delete userObject.password;
    delete userObject.resetPasswordToken;
    delete userObject.resetPasswordExpire;
    delete userObject.emailVerificationToken;
    delete userObject.emailVerificationExpire;
    return userObject;
};

module.exports = mongoose.model("User", UserSchema);

